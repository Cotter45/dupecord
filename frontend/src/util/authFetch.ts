import Cookies from 'js-cookie';

export async function authFetch(url: string, options: any = {}, token?: string) {
  // set options.method to 'GET' if there is no method
  options.method = options.method || 'GET';
  // set options.headers to an empty object if there is no headers
  options.headers = options.headers || {};

  // if the options.method is not 'GET', then set the "Content-Type" header to
  // "application/json", and set the "CSRF-TOKEN" header to the value of the
  // "XSRF-TOKEN" cookie
  if (options.method.toUpperCase() !== 'GET') {
    // if the Content-Type is multipart/form-data we are removing it so that the
    // browser can set the appropriate boundaries for us.
    if (options.headers['Content-Type'] === 'multipart/form-data') {
      delete options.headers['Content-Type'];
    } else {
      options.headers['Content-Type'] =
        options.headers['Content-Type'] || 'application/json';
      options.headers['Keep-Alive'] =
        options.headers['Keep-Alive'] || 'timeout=60, max=100';
    }
    if (!token) {
      options.headers['XSRF-TOKEN'] = Cookies.get('XSRF-TOKEN');
      options.headers['BEARER-TOKEN'] = Cookies.get('BEARER-TOKEN');
    }
  }
  options.headers['authorization'] = token;
  // call the default window's fetch with the url and the options passed in
  const res: any = await window.fetch(url, options);

  // if the response status code is 400 or above, then throw an error with the
  // error being the response
  if (res.status >= 400) {
    const err = await res.json();
    throw err;
  }

  // if the response status code is under 400, then return the response to the
  // next promise chain
  const response = await res.json();
  if (response.redirect) {
    window.location.href = response.url;
  }
  return response;
}