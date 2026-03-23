const https = require('https');

https.get('https://api.github.com/repos/LaoChen1994/pdyform/actions/runs?per_page=1', {
  headers: {
    'User-Agent': 'node.js'
  }
}, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const runs = JSON.parse(data);
    const runId = runs.workflow_runs[0].id;
    console.log(`Latest Run ID: ${runId}`);
    
    https.get(`https://api.github.com/repos/LaoChen1994/pdyform/actions/runs/${runId}/jobs`, {
      headers: { 'User-Agent': 'node.js' }
    }, (res2) => {
      let data2 = '';
      res2.on('data', chunk => data2 += chunk);
      res2.on('end', () => {
        const jobs = JSON.parse(data2);
        jobs.jobs.forEach(job => {
          console.log(`Job: ${job.name}, Status: ${job.conclusion}`);
          job.steps.forEach(step => {
            if (step.conclusion === 'failure') {
              console.log(`Failed Step: ${step.name}`);
            }
          });
        });
      });
    });
  });
}).on('error', err => console.error(err));
