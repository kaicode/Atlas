define([
	'knockout',
	'text!./concept-sets.html',
	'appConfig',
  'providers/Component',
  'webapi/AuthAPI',
  'pages/concept-sets/const',
	// 'services/file',
	'less!./concept-sets.less',
], function (
  ko,
  view,
  config,
  Component,
  authAPI,
  helpers,
  // fileService
) {
	class ConceptSets extends Component {
		constructor(params) {
      super(params);
      this.model = params.model;
      this.mode = ko.observable("add");
      this.toggleText = ko.observable("Export Mode");
      this.exportTable = null;
      this.exportRowCount = ko.observable(0);
      this.exportConceptSets = [];

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
    }
    
    onRespositoryConceptSetSelected(conceptSet) {
			window.location.href = helpers.paths.details(conceptSet.id);
    }
    
    onConceptSetBrowserAction(result) {
			// Inspect the result to see what type of action was taken. For now
			// we're handling the 'add' action
			if (result.action == 'add') {
				this.newConceptSet();
			}
    }
    
    onExportAction(result) {
			if (result.action == 'add') {
				// Get the items we'd like to export from the table
				var itemsForExport = $('#exportConceptSetTable').DataTable().rows('.selected').data();
				var conceptSetIds = $.map(itemsForExport, function (obj) {
					return obj.id
				}).join('%2B'); // + encoded
				if (conceptSetIds.length > 0) {
					// fileService
					// 	.loadZip(helpers.apiPaths.export(conceptSetIds), 'exportedConceptSets.zip')
					// 	.finally(() => this.isInProgress(false));
				}
			}
    }
    
    toggle() {
			if (this.mode() == "add") {
				this.mode("export");
				this.toggleText("Browse/Add Concept Sets");
			} else {
				this.mode("add");
				this.toggleText("Export Mode");
			}
    }
    
    exportOnConceptSetSelected(conceptSet, valueAccessor) {
			$(valueAccessor.currentTarget).toggleClass('selected');
			if (this.exportTable == null) {
				this.exportTable = $(valueAccessor.currentTarget.parentElement.parentElement).DataTable();
			}
			this.exportRowCount(this.exportTable.rows('.selected').data().length);
		}

		newConceptSet() {
			if (this.model.currentConceptSet() == undefined) {
				this.model.currentConceptSetSource('repository');
				window.location.href = helpers.paths.details(0);
			}
		}
	}

	return Component.build(ConceptSets);
});
