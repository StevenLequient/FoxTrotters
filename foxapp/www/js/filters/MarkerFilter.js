/**
 * Created by user on 01/06/17.
 */
angular.module('foxapp')
.filter('filterByCriteria', [function(){

  return function(items, criteria, category){
  if(criteria === undefined) {
    criteria = '';
  }

  if(category !== '') {
    items = filterByCategory(items, category);
  }
  switch(criteria){

    default:
      return filterByName(items, criteria);
  }
};

function filterByName(items, criteria){
    if(criteria === '') {
      return items;
    }

    var filtered = [];

    for (var mrk in items) {
      if (items[mrk].name.toLowerCase().indexOf(criteria.toLowerCase()) !== -1) {
        filtered.push(items[mrk]);
      }
    }

    return filtered;
  };

function filterByCategory(items, category){
  var filtered = [];

  for (var mrk in items) {
    if (items[mrk].typep.toLowerCase().indexOf(category.toLowerCase()) !== -1) {
      filtered.push(items[mrk]);
    }
  }

  return filtered;
};

}]);
