import axios from 'axios';

const SOLR_URL = process.env.SOLR_URL || 'http://127.0.0.1:8983/solr/problems';

export const isSolrAvailable = async () => {
  try {
    await axios.get(`${SOLR_URL}/admin/ping`, { timeout: 3000 });
    return true;
  } catch {
    return false;
  }
};

export const indexProblem = async (problem) => {
  try {
    await axios.post(`${SOLR_URL}/update?commit=true`, [{
      id: problem._id.toString(),
      title: problem.title,
      slug: problem.slug,
      difficulty: problem.difficulty,
      tags: problem.tags || [],
      description: problem.description,
    }], { headers: { 'Content-Type': 'application/json' }, timeout: 5000 });
  } catch (error) {
    console.warn('Solr index failed:', error.message);
  }
};

export const searchProblems = async (query) => {
  const response = await axios.get(`${SOLR_URL}/select`, {
    params: {
      q: query ? `title:*${query}* OR description:*${query}* OR tags:*${query}*` : '*:*',
      wt: 'json',
      rows: 50,
    },
    timeout: 5000,
  });
  return response.data.response.docs.map((doc) => doc.id);
};

export const reindexAllProblems = async (problems) => {
  if (!(await isSolrAvailable())) return false;

  try {
    await axios.post(`${SOLR_URL}/update?commit=true`, { delete: { query: '*:*' } }, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 5000,
    });

    if (problems.length === 0) return true;

    await axios.post(`${SOLR_URL}/update?commit=true`, problems.map((p) => ({
      id: p._id.toString(),
      title: p.title,
      slug: p.slug,
      difficulty: p.difficulty,
      tags: p.tags || [],
      description: p.description,
    })), { headers: { 'Content-Type': 'application/json' }, timeout: 10000 });

    console.log(`Solr indexed ${problems.length} problems`);
    return true;
  } catch (error) {
    console.warn('Solr reindex failed:', error.message);
    return false;
  }
};
