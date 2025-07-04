export let jobMemory = [];

export function saveJobsToMemory(jobs) {
  jobMemory = jobs;
}

export function getJobsFromMemory() {
  return jobMemory;
}
