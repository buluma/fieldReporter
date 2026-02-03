$(document).ready(function(){
  fetchObjectives();
});
// grab url params
// Getting URL var by its name
var itemtype = $.getUrlVar('type');
var itemid = $.getUrlVar('store_id');
var storename = decodeURI($.getUrlVar('store_name'));
var store_server_id = $.getUrlVar('store_server_id');

function fetchObjectives(){
    var q = "SELECT * FROM other_objectives WHERE store_id = ? ORDER BY created DESC LIMIT 10"; 
    db.transaction(function (t) {
        t.executeSql(q, [itemid], function (t, data) {     
          var pl ='';
          for (var i =0;i<data.rows.length;i++) {
            pl += '<a href="#" class="list-group-item">';
            pl += '<span class="badge">'+data.rows.item(i).created+'</span>';
            pl += '<h4 class="list-group-item-heading">'+data.rows.item(i).objective+'</h4>';
            pl += '<p><strong>Achieved:</strong> '+data.rows.item(i).objective_achieved+'</p>';
          
            if (data.rows.item(i).objective_achieved == 'No'){
                pl += '<p><strong>Challenge Faced:</strong> '+data.rows.item(i).challenge+'</p>';
            }  
            
            pl += '<p><strong>Next Plan:</strong> '+data.rows.item(i).next_plan+'</p>';
            pl += '</a>';
          }
              $('article#objectivelist .dataList').html(pl);
        });
    });
    
}
function saveObjective() {
    var coords = userlocation;
    var objective = document.getElementById("objective").value;
    var objective_achieved = document.getElementById("obj_achieved").value;
    var challenge = document.getElementById("obj_challenge").value;
    var next_plan = document.getElementById("obj_plan").value;
    var submitter = username;
    var store = storename;

    db.transaction(function(st) { 
        //st.executeSql('DROP TABLE objectives');
        st.executeSql('CREATE TABLE IF NOT EXISTS other_objectives (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,inputdate VARCHAR, coords VARCHAR,objective VARCHAR, objective_achieved VARCHAR, challenge VARCHAR, next_plan VARCHAR, submitter VARCHAR,store VARCHAR,store_id INTEGER, store_server_id INTEGER,modified TEXT, created TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,last_sync TEXT DEFAULT "none")');
        st.executeSql("INSERT INTO other_objectives(coords,objective,objective_achieved,challenge,next_plan,submitter,store,store_id,store_server_id) values (?,?,?,?,?,?,?,?,?)",
            [coords,objective,objective_achieved,challenge,next_plan,submitter,store,itemid,store_server_id], alertSuccess);
    },function(error){
        console.log(error.message)
    },onReadyTransaction);
}

var backLink = '<h5><a href="storemenu.html?store_id='+itemid+'&store_server_id='+store_server_id+'&store_name='+storename+'" class="button">';
backLink += '<span class="glyphicon glyphicon-arrow-left"> '+storename+'</a></h5>';

var newsku = '<h4 class="pull-left"> My Other Objectives</h4>';
newsku += '<button type="button" class="btn btn-warning pull-right" data-toggle="modal" data-target="#form-modal">Add</button>';


$(document).ready(function() {
    $('.navbar-header').append(backLink);
    $('#newsku').append(newsku);

    $('form#objectivesinput').on('submit', function(e){
        e.preventDefault();
        if (formValidated(this)){
            saveObjective();
            $('#objectivesinput input)').val('');      
        }           
    });
    $('#form-modal').on('hidden.bs.modal', function (e) {
        fetchObjectives();
    })
});