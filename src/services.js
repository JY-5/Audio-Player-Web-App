export const createComment = (username, comment, timestamp) => {
    return fetch('/api/comment',  {
      method: 'POST',
      headers: new Headers({
        'content-type': 'application/json',
      }),
      body: JSON.stringify({ username, comment, timestamp }),
    })
    .catch( () => Promise.reject({ error: 'network-error'} ) )
    .then( response => {
      if(response.ok) {
        return response.json();
      }
      return response.json().then( json => Promise.reject(json) );
    });
  }

export const getComments = () => {
  return fetch('/api/comments',  {
    method: 'GET',
  })
  .catch( () => Promise.reject({ error: 'network-error'} ) )
  .then( response => {
    if(response.ok) {
      return response.json();
    }
    return response.json().then( json => Promise.reject(json) );
  });
};
