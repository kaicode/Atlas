define([
  'knockout',
  'text!./cohort-concept-set-browser.html',
  'providers/Component',
  'providers/ConceptSet',
  'vocabularyprovider',
  'appConfig',
  'webapi/AuthAPI',
  'webapi/MomentAPI',
  'access-denied',
  'databindings',
  'less!./cohort-concept-set-browser.less'
], function (
  ko,
  view,
  Component,
  ConceptSet,
  VocabularyProvider,
  appConfig,
  authApi,
  momentApi
) {
	class CohortConceptSetBrowser extends Component {
    static get name() {
      return 'cohort-concept-set-browser';
    }

    static get view() {
      return view;
    }

    constructor(params) {
      super(params);
      this.criteriaContext = params.criteriaContext;
      this.cohortConceptSets = params.cohortConceptSets;
      this.onActionComplete = params.onActionComplete;
      this.onRespositoryConceptSetSelected = result => params.onRespositoryConceptSetSelected(result) || defaultRepositoryConceptSetSelected;
      this.disableConceptSetButton = this.setDisabledConceptSetButton(params.disableConceptSetButton);
      this.buttonActionEnabled = params.buttonActionEnabled !== false;
      this.buttonActionText = params.buttonActionText || "New Concept Set";
      this.repositoryConceptSetTableId = params.repositoryConceptSetTableId || "repositoryConceptSetTable";

      this.loading = ko.observable(false);
      this.repositoryConceptSets = ko.observableArray();

      this.sources = [];
      this.sources.push(appConfig.api);
      this.selectedSource = ko.observable(this.sources[0]);

      this.isAuthenticated = authApi.isAuthenticated;
      this.canReadConceptsets = ko.pureComputed(() => {
        return (appConfig.userAuthenticationEnabled && this.isAuthenticated() && authApi.isPermittedReadConceptsets()) || !appConfig.userAuthenticationEnabled;
      });
      this.canReadCohorts = ko.pureComputed(() => {
        return (config.userAuthenticationEnabled && this.isAuthenticated() && authApi.isPermittedReadCohorts()) || !config.userAuthenticationEnabled;
      });

      // startup actions
      this.loadConceptSetsFromRepository(this.selectedSource().url);
    }

    loadConceptSetsFromRepository(url) {
      this.loading(true);

      VocabularyProvider.getConceptSetList(url)
        .done((results) => {
          this.repositoryConceptSets(results);
          this.loading(false);
        })
        .fail((err) => {
          console.log(err);
        });
    }

    selectRepositoryConceptSet(data, context, event) {
      this.onRespositoryConceptSetSelected(data, event);
    }

    addConceptSet() {
      this.onActionComplete({
        action: 'add',
        status: 'Success'
      });
    }

    defaultRepositoryConceptSetSelected(conceptSet) {
      // Default functionality
      VocabularyProvider.getConceptSetExpression(
        conceptSet.id,
        this.selectedSource().url
      )
        .done((result) => {
          var newId = this.cohortConceptSets()
            .length > 0 ? Math.max.apply(null, this.cohortConceptSets()
              .map(function (d) {
                return d.id;
              })) + 1 : 0;

          var newConceptSet = new ConceptSet({
            id: newId,
            name: conceptSet.name,
            expression: result
          });
          params.$raw.cohortConceptSets().push(newConceptSet);
          this.criteriaContext() && this.criteriaContext().conceptSetId(newConceptSet.id);
          this.onActionComplete({
            action: 'load',
            status: 'Success'
          });
        })
        .fail(function (err) {
          console.log(err);
        });
    }


    setDisabledConceptSetButton(action) {
      if (action && action()) {
        return action()
      } else {
        return false;
      }
    }

    formatDate(data, type, row) {
      return momentApi.formatDateTimeUTC(data);
    }
	}

	return Component.build(CohortConceptSetBrowser);
});
