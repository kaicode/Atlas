define([
	'knockout',
	'text!./export.html',
	'appConfig',
	'providers/Component',
	'utils/commonUtils',
	'webapi/AuthAPI',
  'pages/concept-sets/const',
	'services/file',
	'components/heading',
	'components/circe/cohort-concept-set-browser',
	'less!./export.less',
], function (
  ko,
  view,
  config,
	Component,
	commonUtils,
  authApi,
  constants,
	fileService,
) {
	class ConceptSetsExport extends Component {
		constructor(params) {
      super(params);
      this.model = params.model;
      this.exportTable = null;
      this.exportRowCount = ko.observable(0);
			this.exportConceptSets = [];
			this.isInProgress = ko.observable(false);

      this.isAuthenticated = authApi.isAuthenticated;
      this.canReadConceptsets = ko.pureComputed(() => {
        return (
          config.userAuthenticationEnabled
          && this.isAuthenticated()
          && authApi.isPermittedReadConceptsets()
        ) || !config.userAuthenticationEnabled;
      });
    }
        
    onExportAction(result) {
			if (result.action == 'add') {
				// Get the items we'd like to export from the table
				var itemsForExport = $('#exportConceptSetTable').DataTable().rows('.selected').data();
				var conceptSetIds = $.map(itemsForExport, function (obj) {
					return obj.id
				}).join('%2B'); // + encoded
				if (conceptSetIds.length > 0) {
					this.isInProgress(true);
					fileService
						.loadZip(constants.apiPaths.export(conceptSetIds), 'exportedConceptSets.zip')
						.finally(() => this.isInProgress(false));
				}
			}
    }
        
    exportOnConceptSetSelected(conceptSet, valueAccessor) {
			$(valueAccessor.currentTarget).toggleClass('selected');
			if (this.exportTable == null) {
				this.exportTable = $(valueAccessor.currentTarget.parentElement.parentElement).DataTable();
			}
			this.exportRowCount(this.exportTable.rows('.selected').data().length);
		}

	}

	return commonUtils.build('concept-sets-export', ConceptSetsExport, view);
});
