define([
	'knockout',
	'text!./browse.html',
	'appConfig',
	'providers/Component',
	'utils/commonUtils',
	'webapi/AuthAPI',
  'pages/concept-sets/const',
	'components/heading',
	'less!./browse.less',
], function (
  ko,
  view,
  config,
	Component,
	commonUtils,
  authApi,
  constants,
) {
	class ConceptSetsBrowse extends Component {
		constructor(params) {
      super(params);
      this.model = params.model;
			this.isInProgress = ko.observable(false);

      this.isAuthenticated = authApi.isAuthenticated;
      this.canReadConceptsets = ko.pureComputed(() => {
        return (
          config.userAuthenticationEnabled
          && this.isAuthenticated()
          && authApi.isPermittedReadConceptsets()
        ) || !config.userAuthenticationEnabled;
      });
      this.canCreateConceptSet = ko.pureComputed(() => {
        return (
          (authApi.isAuthenticated() && authApi.isPermittedCreateConceptset())
          || !config.userAuthenticationEnabled
        );
			});
			this.onConceptSetBrowserAction = this.onConceptSetBrowserAction.bind(this);
    }
    
    onRespositoryConceptSetSelected(conceptSet) {
			window.location.href = constants.paths.details(conceptSet.id);
    }
    
    onConceptSetBrowserAction(result) {
			// Inspect the result to see what type of action was taken. For now
			// we're handling the 'add' action
			if (result.action == 'add') {
				this.newConceptSet();
			}
    }

		newConceptSet() {
			if (this.model.currentConceptSet() == undefined) {
				this.model.currentConceptSetSource('repository');
				window.location.href = constants.paths.details(0);
			}
		}

	}

	return commonUtils.build('concept-sets-browse', ConceptSetsBrowse, view);
});
