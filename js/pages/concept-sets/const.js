define(
  (require, exports) => {
    const pageTitle = 'Concept Sets';
    const paths = {
      details: id => `#/conceptset/${id}/details`,
    };

    return {
      pageTitle,
      paths,
    };
  }
);