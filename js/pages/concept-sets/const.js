define(
  (require, exports) => {
    const config = require('appConfig');

    const pageTitle = 'Concept Sets';
    const paths = {
      details: id => `#/conceptset/${id}/details`,
    };
    const apiPaths = {
      export: ids => `${config.api.url}conceptset/exportlist?conceptsets=${ids}`,
    };

    return {
      pageTitle,
      paths,
      apiPaths,
    };
  }
);