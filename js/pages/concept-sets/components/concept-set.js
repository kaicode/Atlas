define([
	'knockout',
	'text!./concept-set.html',
	'providers/Component',
	'utils/commonUtils',
  'pages/concept-sets/const',
  'appConfig',
	'ohdsi.util',
	'components/conceptset/utils',
	'webapi/CDMResultsAPI',
	'vocabularyprovider',
	'webapi/ConceptSetAPI',
	'conceptsetbuilder/InputTypes/ConceptSet',
	'atlas-state',
	'clipboard',
	'services/ConceptSetService',
  'components/heading',
  'components/conceptset/conceptset-manager',
	'conceptset-modal',
	'less!./concept-set.less',
], function (
  ko,
  view,
	Component,
	commonUtils,
  constants,
  config,
  ohdsiUtil,
  utils,
  cdmResultsAPI,
  vocabularyAPI,
  conceptSetAPI,
  ConceptSet,
  sharedState,
  clipboard,
  conceptSetService
) {
	class ConceptSetComponent extends Component {
		constructor(params) {
      super(params);
      this.model = params.model;
      const authApi = params.model.authApi;
      this.name = ko.observable('Unknown concept set');
      this.isLoading = ko.observable(false);
      this.isAuthenticated = authApi.isAuthenticated;
      this.canReadConceptsets = ko.pureComputed(() => {
        return (config.userAuthenticationEnabled && this.isAuthenticated() && authApi.isPermittedReadConceptsets()) || !config.userAuthenticationEnabled;
      });

      return this;
    }
	}

	return commonUtils.build('concept-set', ConceptSetComponent, view);
});
