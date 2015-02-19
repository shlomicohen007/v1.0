var Categories;
function InitCategories()
{
    ng.ws('getCategories',1,function(c){
             Categories = c;
    });
}
function AddCat(){
    var name = $('#newCat').val();
    Categories.categories.push({_id:Categories.seq,seq:Categories.seq*1000, name:name,categories:[]});
    Categories.seq++;
    ng.ws('saveCategories',Categories,function(){ 
            ng.ReloadContainer('#Categories');
    });
}

function NewCategory(mainIndex){
    var c = {_id:Categories.categories[mainIndex].seq++,
        name:"",
        isActive:false,
        url:""
        };
    Categories.categories[mainIndex].categories.push(c);
    OpenCategoryForm(mainIndex,Categories.categories[mainIndex].categories.length-1);
}
var selectedCat = {};
function OpenCategoryForm(mainIndex,subIndex){
    selectedCat.mainIndex = mainIndex;
    selectedCat.subIndex = subIndex;
    if(mainIndex && subIndex){
      var c = Categories.categories[mainIndex].categories[subIndex];
      ng.bindForm('Category',c);
   }

   openLightBox('#CategoryEditor');
}

function SaveCategory(){
    var url = $('#catUrl').val();
    if(!url){
        url = $('#catName').val();
    }
    url = url.replace(/ /g,"-");
    $('#catUrl').val(url);
    Categories.categories[selectedCat.mainIndex].categories[selectedCat.subIndex] = ng.getFormData('Category');
    var cat2sort = Categories.categories[selectedCat.mainIndex].categories;
    cat2sort.sort(function (a, b) {
        if (!b.position)
            b.position = 99;
        if (!a.position)
            a.position = 99;
        return b.position - a.position;
    });
    Categories.categories[selectedCat.mainIndex] = cat2sort;
     ng.ws('saveCategories',Categories,function(){ 
            ng.ReloadContainer('#Categories');
            closeLightBox();
    });
}

function showSub(indx){
    $('.subA').hide();
    $('.sub'+indx).show();
}