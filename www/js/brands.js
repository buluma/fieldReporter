document.addEventListener("deviceready",function(){
  fetchStocks();
},false);

// grab url params
// Getting URL var by its name
var itemtype = $.getUrlVar('type');
var itemid = $.getUrlVar('store_id');
var storename = decodeURI($.getUrlVar('store_name'));
var store_server_id = $.getUrlVar('store_server_id');

$(function() {
  //datepicker if user is a team leader
  if (assigned == 'team-leader'){
    $('input#brand_stockdate').removeAttr('disabled');
    $('#brand_stockdate').datetimepicker({format:'D-M-YYYY'});
  }
  else {
    $('input#brand_stockdate').val(getTodaysDate());
  }
});
function fetchStocks() {
  var q = "SELECT * FROM brandstocks WHERE store_id = ? ORDER BY created DESC"; 
  db.transaction(function (t) {
    t.executeSql(q, [itemid], function (t, data) {
      var pl ='';
      for (var i =0;i<data.rows.length;i++) {
        pl += '<a href="#" class="list-group-item">';
        pl += '<span class="badge">'+data.rows.item(i).stockdate+'</span>';
        pl += '<h4 class="list-group-item-heading">'+data.rows.item(i).brand+'</h4>';
        pl += '<p><strong>Current Stock:</strong> '+data.rows.item(i).currentstock+'</p>';
        pl += '<p><strong>Order Placed:</strong> '+data.rows.item(i).orderplaced+'</p>';
        pl += '<p><strong>Expected Delivery:</strong> '+data.rows.item(i).expected_delivery+'</p>';
        pl += '<p><strong>Stock Out:</strong> '+data.rows.item(i).stockout+'</p>';
        pl += '<p><strong>Remarks:</strong> '+data.rows.item(i).remarks+'</p>';
        pl += '</a>';
      }
		  $('article#skulist .dataList').html(pl);
    });
  });
}
function insertStock() {
  var coords = userlocation;
  var brandcode = document.getElementById("brands").value;
  var brand = $("#brands option:selected").text();
  //var txt = $("#ddlViewBy option:selected").text();
  var stockdate = document.getElementById("brand_stockdate").value;
  var currentstock = document.getElementById("brand_stock").value;
  var sale = document.getElementById("brand_sale").value;
  var orderplaced = document.getElementById("brand_order").value;
  var expected_delivery = document.getElementById("brand_delivery").value;
  var stockoutstate = $('#brand_stockout').prop('checked');
  if (stockoutstate === true) {
  	var stockout = 'Yes';
  }
  else { var stockout = 'No';}
  var remarks = document.getElementById("brand_remarks").value;
  var submitter = username;
  var store = storename;

  db.transaction(function(st) {
    //st.executeSql('DROP TABLE brandstocks');
    st.executeSql('CREATE TABLE IF NOT EXISTS brandstocks (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,stockdate VARCHAR, coords VARCHAR,brand VARCHAR,brandcode VARCHAR,currentstock VARCHAR,sale VARCHAR, orderplaced VARCHAR, expected_delivery VARCHAR, stockout VARCHAR, submitter VARCHAR,store VARCHAR,store_id INTEGER, store_server_id INTEGER, remarks VARCHAR,modified TEXT, created TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,last_sync TEXT DEFAULT "none")');
    st.executeSql("INSERT INTO brandstocks(coords,stockdate,brand,brandcode,currentstock,sale,orderplaced,expected_delivery,stockout,submitter,store,store_id,store_server_id,remarks) values ('"+coords+"','"+stockdate+"','"+brand+"','"+brandcode+"','"+currentstock+"','"+sale+"','"+orderplaced+"','"+expected_delivery+"','"+stockout+"','"+submitter+"','"+store+"','"+itemid+"','"+store_server_id+"','"+remarks+"')",null, alertSuccess);
  },function(error){
    console.log(error.message)
  },onReadyTransaction);
}

var backLink = '<h5><a href="storemenu.html?store_id='+itemid+'&store_server_id='+store_server_id+'&store_name='+storename+'" class="button">';
backLink += '<span class="glyphicon glyphicon-arrow-left"> '+storename+'</a></h5>';

var newsku = '<h4 class="pull-left"> Brand Stocks </h4>';
newsku += '<button type="button" class="btn btn-warning pull-right" data-toggle="modal" data-target="#form-modal">Add</button>';

var eabl_products = '<label>Product</label>';
eabl_products += '<select name="brands" class="form-control" id="brands">';
//eabl_products += main_products;
//eabl_products += fetchProductsForSelect();
eabl_products += '</select>';

$(document).ready(function() {
  fetchProductsForSelect(function(options){
    $('#brands').append(options);
  })
	$('#brand_stockout').bootstrapToggle();
	// listen if toggle is on or off : true --- false
	$('#brand_stockout').change(function() {
    $('#console-event').html('Toggle: ' + $(this).prop('checked'))
    //console.log('Toggle: ' + $(this).prop('checked'));
  })
	$('.navbar-header').append(backLink);
	$('#newsku').append(newsku);
  $('#selectbrands').html(eabl_products);

  $('form#formskuinput').on('submit', function(e){
    e.preventDefault();
    if (formValidated(this)){
      insertStock();
      $('#formskuinput input:not("#brand_stockdate")').val('');
    }
  });
  $('#form-modal').on('hidden.bs.modal', function (e) {
    fetchStocks();
    //document.location.reload(true);
  })
  //document.getElementById("brands").innerHTML = fetchProductsForSelect();
});
