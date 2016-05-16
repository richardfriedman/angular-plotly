(function() {
    'use strict';
    angular.module('plotly', []).directive('plotly', [
        '$window',
        function($window) {
            return {
                restrict: 'E',
                template: '<div></div>',
                scope: {
                    data: '=',
                    layout: '=',
                    options: '='
                },
                link: function(scope, element) {
                    var graph = element[0].children[0];
                    var initialized = false;

                    function onUpdate() {
                        //No data yet, or clearing out old data
                        if (!(scope.data)) {
                            if (initialized) {
                                Plotly.Plots.purge(graph);
                                graph.innerHTML = '';
                            }
                            return;
                        }
                        //If this is the first run with data, initialize
                        if (!initialized) {
                            initialized = true;
                            Plotly.newPlot(graph, scope.data, scope.layout, scope.options);
                        }
                        graph.layout = scope.layout;
                        graph.data = scope.data;
                        Plotly.redraw(graph);
                        Plotly.Plots.resize(graph);
                    }

                    function onResize() {
                        if (!(initialized && scope.data)) return;
                        Plotly.Plots.resize(graph);
                    }

                    // If data updated redraw.
                    var updateOnChange = function(newValue,oldValue){
                        if ( initialized && angular.equals(newValue, oldValue)) return;
                        onUpdate();
                    }
                    // Monitor Data and Layout deeply.
                    scope.$watch('data', updateOnChange, true);
                    scope.$watch('layout', updateOnChange, true);
                    scope.$watch(function() {
                        return {
                            'h': element[0].offsetHeight,
                            'w': element[0].offsetWidth
                        };
                    }, updateOnChange, true);

                    angular.element($window).bind('resize', onResize );
                }
            };
        }
    ]);
})();
