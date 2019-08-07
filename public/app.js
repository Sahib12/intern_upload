var app = angular.module("myApp",[]);

app.controller("onlyController",["$scope", function($scope){
    
    $scope.formData = {name:""};
    document.getElementById('files').addEventListener('change', function (event) {
  const file = event.target.files;
    if(!$scope.formData.name){
        alert("Please enter your name first.");
        return;
    }
    var response = confirm("Do you want to upload all these files ?");
    if(response) postData(file);
  
}, false);
    async function postData(files){
        name = $scope.formData.name;
        var arr = [];
        var ref = firebase.storage().ref().child("sample");
        for(var i = 0; i < files.length; i++){
            var key = firebase.database().ref("sample/").push().key;
            try{
                var data = await ref.child(key).put(files[i]);
            }
            catch(err){
                alert(err);
            }
            var url = await data.ref.getDownloadURL();
            console.log(url);
            arr.push(url);
            
            try{
                await firebase.database().ref("sample/" + name + "/" + key).set(url);
                alert("File " + (i+1) + " was saved successfully. Please wait until all the files are saved in the database");
            }
            catch(err){
                alert(err);
            }
        }
        alert("All the files were uploaded successfully")
    } 
}])




app.controller("downloadController",["$scope", function($scope){
    
    $scope.formData = {name:""};
    
    $scope.download = async function(){
        try{
            firebase.database().ref("sample/" + $scope.formData.name).once("value").then(function(data){
                $scope.result = data.val();
                console.log($scope.result);
                $scope.$apply();
            })
        }
        catch(e){ 
            alert(e)
        }
                 
    }
}])