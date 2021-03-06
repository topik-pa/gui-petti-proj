
const index = {
  init: async () => {
    console.log('index')
    const $table = $('#table')
    const $remove = $('#remove')
    let selections = []
    $(function () {
      $table.bootstrapTable('destroy')
      $table.bootstrapTable({
        columns: [
          [
            {
              title: 'P1 Name',
              field: 'p1Name',
              sortable: true,
              valign: 'middle'
            },
            {
              title: 'P2 Name',
              field: 'p2Name',
              sortable: true,
              valign: 'middle'
            },

            {
              title: 'P1 Odds',
              field: 'p1Odds',
              sortable: true,
              valign: 'middle'
            },
            {
              title: 'P2 Odds',
              field: 'p2Odds',
              sortable: true,
              valign: 'middle'
            },

            {
              title: 'P1 Bet',
              field: 'p1Bet',
              sortable: true,
              valign: 'middle'
            },
            {
              title: 'P2 Bet',
              field: 'p2Bet',
              sortable: true,
              valign: 'middle'
            },

            {
              title: 'Fav Correct Score',
              field: 'favCorrectScore',
              sortable: true,
              valign: 'middle'
            },

            {
              title: 'P1 Handicap ',
              field: 'p1Handicap ',
              sortable: true,
              valign: 'middle'
            },
            {
              title: 'P2 Handicap ',
              field: 'p2Handicap ',
              sortable: true,
              valign: 'middle'
            },

            {
              title: 'Over',
              field: 'over',
              sortable: true,
              valign: 'middle'
            },
            {
              title: 'Type',
              field: 'type',
              sortable: true,
              valign: 'middle'
            },
            {
              title: 'Field',
              field: 'field',
              sortable: true,
              valign: 'middle'
            },
            {
              title: 'Link',
              field: 'link',
              sortable: false,
              valign: 'right'
            }]],

        classes: 'table table-hover table-no-bordered',
        toolbar: '#toolbar',
        buttonsClass: 'outline-secondary',
        sortClass: undefined,
        undefinedText: '-',
        striped: true,
        sortName: 'number',
        sortOrder: 'desc',
        sortStable: false,
        sortable: true,
        pagination: true,
        paginationLoop: false,
        onlyInfoPagination: false,
        pageNumber: 1,
        pageSize: 5,
        pageList: [1, 3, 5, 10, 'ALL'],
        paginationPreText: 'Previous',
        paginationNextText: 'Next',
        selectItemName: 'btSelectItem',
        smartDisplay: true,
        search: true,
        searchOnEnterKey: false,
        strictSearch: false,
        searchText: '',
        searchTimeOut: '500',
        trimOnSearch: true,
        searchalign: 'right',
        buttonsAlign: 'right',
        toolbarAlign: 'left',
        paginationVAlign: 'bottom',
        paginationHAlign: 'right',
        paginationDetailHAlign: 'left',
        showHeader: true,
        showFooter: false,
        showColumns: true,
        showRefresh: true,
        showToggle: false,
        showExport: true,
        showPaginationSwitch: true,
        showFullscreen: false,
        minimumCountColumns: 5,
        idField: undefined,
        clickToSelect: false,
        uniqueId: 'id',
        singleSelect: false,
        checkboxHeader: true,
        maintainSelected: true
        // reorderableColumns: true,
        // iconsPrefix: "material-icons", // material-icons of fa (font awesome)
        // icons: {
        //   paginationSwitchDown: "material-icons-collapse-down icon-chevron-down",
        //   paginationSwitchUp: "material-icons-collapse-up icon-chevron-up",
        //   refresh: "material-icons-refresh icon-refresh",
        //   toggle: "material-icons-list-alt icon-list-alt",
        //   columns: "material-icons-th icon-th",
        //   detailOpen: "glyphicon-plus icon-plus",
        //   detailClose: "glyphicon-minus icon-minus"
        // }
      })
      $table.on(
        'check.bs.table uncheck.bs.table ' +
  'check-all.bs.table uncheck-all.bs.table',
        function () {
          $remove.prop('disabled', !$table.bootstrapTable('getSelections').length)
          selections = getIdSelections()
        })

      $remove.click(function () {
        const ids = getIdSelections()
        $table.bootstrapTable('remove', {
          field: 'id',
          values: ids
        })

        $remove.prop('disabled', true)
      })
      $('[data-toggle="dropdown"] >i')
        .removeClass('glyphicon-export')
        .addClass('fa-download')
    })
    function getIdSelections () {
      return $.map($table.bootstrapTable('getSelections'), function (row) {
        return row.id
      })
    }
    function actionFormatter (value, row, index) {
      return ['<button class="remove btn btn-danger btn-sm">Delete</button>'].join(
        '')
    }
    window.actionEvents = {
      'click .remove': function (e, value, row, index) {
        $table.bootstrapTable('remove', {
          field: 'id',
          values: [row.id]
        })
      }
    }
  }
}

export default index
