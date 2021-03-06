define(
  (require, factory) => {
    const { Route } = require('providers/Route');
    function routes(appModel) {
      return {
        '/': new Route(() => {
          appModel.activePage(this.title);
          document.location = "#/home";
        }),
        '/home': new Route(() => {
          appModel.activePage(this.title);
          require(['home'], function () {
            appModel.componentParams = {
              model: appModel
            };
            appModel.currentView('home');
          });
        }),
        '/welcome/:token': new Route((token) => {
          appModel.activePage(this.title);
          require(['welcome'], function () {
            authApi.token(token);
            document.location = "#/welcome";
          });
        }),
      };
    }

    return routes;
  }
);