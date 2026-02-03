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
    var q = "SELECT * FROM objectives WHERE store_id = ? ORDER BY created DESC LIMIT 10"; 
    db.transaction(function (t) {
        t.executeSql(q, [itemid], function (t, data) {     
          var pl ='';
          for (var i =0;i<data.rows.length;i++) {
            pl += '<a href="#" class="list-group-item">';
            pl += '<span class="badge">'+data.rows.item(i).created+'</span>';
            pl += '<h4 class="list-group-item-heading">'+data.rows.item(i).objective_desc+'</h4>';

            if (data.rows.item(i).response_type == 'agree'){
                pl += '<p><strong>Achieved:</strong> '+data.rows.item(i).objective_achieved+'</p>';
                if (data.rows.item(i).objective_achieved == 'No'){
                    pl += '<p><strong>Reason Not Achieved:</strong> '+data.rows.item(i).reason_not_achieved+'</p>';
                }  
            }
            else {
                pl += '<p><strong>Target Score:</strong> '+data.rows.item(i).targetscore+'</p>';
                pl += '<p><strong>Target Facings:</strong> '+data.rows.item(i).targetfacings+'</p>';
                pl += '<p><strong>Current Percentage:</strong> '+data.rows.item(i).current_percent+'</p>';
                pl += '<p><strong>Current Facings:</strong> '+data.rows.item(i).current_facings+'</p>';
            }
            
            pl += '<p><strong>Action Point:</strong> '+data.rows.item(i).action_point+'</p>';
            pl += '</a>';
          }
              $('article#objectivelist .dataList').html(pl);
        });
    });
    
}
function saveObjective() {
    var coords = userlocation;
    var objective_code = document.getElementById("objectives").value;
    var objective_desc = $("#objectives option:selected").text();
    var responsetype = $('#objectives option:selected').data('responsetype');
    var categorytotal = document.getElementById("obj_cat_total").value;
    var targetscore = document.getElementById("obj_tgt_score").value;
    var targetfacings = document.getElementById("obj_tgt_fac").value;
    var current_percent = document.getElementById("obj_curr_perc").value; 
    var current_facings = document.getElementById('obj_curr_facings').value;
    var action_point = document.getElementById("obj_action").value;
    var objective_achieved = document.getElementById("obj_yes_no").value;
    var reason = document.getElementById("obj_ifnowhy").value;
    var submitter = username;
    var store = storename;
    //var store_server_id = store_server_id;

    db.transaction(function(st) { 
        //st.executeSql('DROP TABLE objectives');
        st.executeSql('CREATE TABLE IF NOT EXISTS objectives (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,inputdate VARCHAR, coords VARCHAR,objective_code VARCHAR,objective_desc VARCHAR,targetscore VARCHAR,targetfacings VARCHAR, current_percent VARCHAR,current_facings VARCHAR, categorytotal VARCHAR, response_type VARCHAR, objective_achieved VARCHAR, reason_not_achieved VARCHAR, submitter VARCHAR,store VARCHAR,store_id INTEGER, store_server_id INTEGER, action_point VARCHAR,modified TEXT, created TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,last_sync TEXT DEFAULT "none")');
        st.executeSql("INSERT INTO objectives(coords,objective_desc,objective_code,response_type,categorytotal,targetscore,targetfacings,current_percent,current_facings,objective_achieved,reason_not_achieved,submitter,store,store_id,store_server_id,action_point) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
            [coords,objective_desc,objective_code,responsetype,categorytotal,targetscore,targetfacings,current_percent,current_facings,objective_achieved,reason,submitter,store,itemid,store_server_id,action_point], alertSuccess);
    },function(error){
        console.log(error.message)
    },onReadyTransaction);
}

var backLink = '<h5><a href="storemenu.html?store_id='+itemid+'&store_server_id='+store_server_id+'&store_name='+storename+'" class="button">';
backLink += '<span class="glyphicon glyphicon-arrow-left"> '+storename+'</a></h5>';

var newsku = '<h4 class="pull-left"> Objectives & Targets</h4>';
newsku += '<button type="button" class="btn btn-warning pull-right" data-toggle="modal" data-target="#form-modal">Add</button>';

var objs = '<label>Objective</label>';
objs += '<select name="objectives" class="form-control" id="objectives">';
//objs += objectives;
objs += '</select>';

$(document).ready(function() {
    fetchObjectivesForSelect(function(options){
        $('#objectives').append(options);
    })
    $('.navbar-header').append(backLink);
    $('#newsku').append(newsku);
    $('#selectobjectives').html(objs);

    $('form#objectivesinput').on('submit', function(e){
        e.preventDefault();
        if (formValidated(this)){
            saveObjective();
            $('#objectivesinput input:not("#obj_tgt_score")').val('');      
        }           
    });
    $('#form-modal').on('hidden.bs.modal', function (e) {
        fetchObjectives();
    })
    $('#objectives').on('change',function(){
        // toggle response type
        var type = $("#objectives option:selected").data('responsetype');
        if (type == 'agree') {$('.agree-group').show();$('.score-group').hide();}
        if (type == 'score') {
            var targetscore = $("#objectives option:selected").data('targetscore');
            // autofill the target score
            $('#obj_tgt_score').val(targetscore);

            $('.agree-group').hide();$('.score-group').show();
        }
    })
    // calculate the target facings based on current category total
    $('#obj_cat_total').on('keyup',function(){
        var ratio = $('#obj_tgt_score').val()/100;
        var tfacings = ratio * $(this).val();
        $('#obj_tgt_fac').val(Math.round(tfacings));

    })
    // calculate the current percentage
    $('#obj_curr_facings').on('keyup',function(){
        var ratio = $(this).val()/$('#obj_cat_total').val();
        var cpercent = ratio * 100;
        $('#obj_curr_perc').val(Math.round(cpercent));

    })
});