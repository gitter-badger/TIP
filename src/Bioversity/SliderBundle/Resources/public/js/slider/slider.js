/**
 *	Slider configurator file.
 *
 *	There you can find the primary bind method an relations request method
 *
 *	@package	ontology slider
 *
 *	@author		Antonino Luca Carella <antonio.carella@gmail.com>
 *	@version	1.00
 */
function generateRootMenu()
{
  //console.log('generateRootMenu');
  $.each(selected_node_data._ids, function(key, value){
    createNodeMenuButton(
      top_menu_layout_id,
      getNodeName(selected_node_data._node[value]),
      getNodeCode(selected_node_data._node[value]),
      value
    );
  });
  //bindRootButton();
}

function generateNodeList(node_list)
{
  //console.log('generateNodeList');
  resetNodeList();
  showNodes();
  goToByScroll(slider_destination_search_node_list_point);
  if(node_list['term'][':WS:PAGING'][':WS:PAGE-COUNT'] > 0){
    setNodePager(node_list['term']);
    $.each(node_list['term'][':WS:RESPONSE'], function(key, value){
      createNodeList(
        value[kTAG_CLASS],
        value[kTAG_NID],
        value[kTAG_GID],
        value[kTAG_LABEL],
        value[kTAG_KIND]
      );
    });
  }else{
    displayNoResult();
  }
}

function hideSearch()
{
  $('#'+slider_destination_search_point+' form').hide();
}

function showSearch()
{
  $('#'+slider_destination_search_point+' form').fadeIn('slow');
}

function showNodes()
{
  $('#'+slider_destination_search_node_point).fadeIn('slow');
}

function hideNodes()
{
  $('#'+slider_destination_search_node_point).fadeOut('slow');
}

function hideSlider()
{
  $('#breadcrumb').hide();
  $('#history_container').hide();
  $('#slider').hide();
  $('#node_legend').hide();
}

function showSlider()
{
  $('#breadcrumb').fadeIn('slow');
  $('#history_container').fadeIn('slow');
  $('#slider').fadeIn('slow');
  $('#node_legend').fadeIn('slow');
}

function startBind(button, predicate, direction)
{
  //console.log('startBind');
  showSlider();
  setAppendDirection(direction);
  startButtonAnimation(button,predicate);
  goToByScroll('slider');
}

//function bindRootButton()
//{
//  $('#entry_point a').click(function(){
//    startBind($(this).attr('class'));
//  });
//}

function startButtonAnimation(button, predicate)
{
  //console.log('startButtonAnimation');
  $('#row_'+button).effect("transfer", { to: $('#'+slider_destination_center_header+' .btn_node') }, 300);
  startDetailAnimation(button, predicate);
}

function startDetailAnimation(button, predicate)
{
  //console.log('startDetailAnimation');
  $('#'+slider_destination_center).fadeOut('slow');
  bindButton(button, predicate);
}

function bindButton(button, predicate)
{
  //console.log('bindButton');
  setNodeId(button);
  setNodePredicate(predicate);
  getNodeById();
}

function initializeNode()
{
  //console.log('initializeNode');
  $.each(selected_node_data._ids, function(key, value){
    if(value == selected_node_id){
      setNodeProperty(selected_node_data._node[value]);
      resetSlider();
      createNodeDetail();
      buildNav();
    }
  });
  initializeNodeRelations();
}

function initializeNodeRelations()
{
  //console.log('initializeNodeRelations');
  getNodeRelationINById();
  getNodeRelationOUTById();
}

//function startButtonListAnimation()
//{
//  //console.log('startButtonListAnimation');
//  $(".btn_node_more").on('click', function(event) {
//    var $detail= $(this).parent();
//    event.stopPropagation();
//    
//    if($detail.attr('class')=='dontshow'){
//      $detail.find(".btn_node_more").html(' - show less');
//      $detail.find(".list_node_detail").slideDown('slow');
//      $detail.attr('class','startshow');
//    }else{
//      $detail.find(".list_node_detail").slideUp('slow');
//      $detail.find(".btn_node_more").html(' + show less');
//      $detail.attr('class','dontshow');
//    }
//    
//  });
//
//}

$(document).ready(function(){
    $(document).on('click',".btn_node_more", function() {
    var detail= $(this).parent();
    
    if(detail.attr('class')=='dontshow'){
      detail.find(".btn_node_more").html(' - show less');
      detail.find(".list_node_detail").slideDown('slow');
      detail.attr('class','startshow');
    }else{
      detail.find(".list_node_detail").slideUp('slow');
      detail.find(".btn_node_more").html(' + show less');
      detail.attr('class','dontshow');
    }
    
  });
});

function generateNodeRelationIN()
{
  //console.log('generateNodeRelationIN');
  if(selected_node_data){
    generateNodeRelations(slider_left_layout_id,slider_destination_left);
  }
}

function generateNodeRelationOUT()
{
  //console.log('generateNodeRelationOUT');
  if(selected_node_data){
    generateNodeRelations(slider_right_layout_id,slider_destination_right);
  }
}

function generateNodeRelations(layout, destination)
{
  //console.log('generateNodeRelations');
  var pager_count;
  
  $.each(selected_node_data._edge, function(key, value){
    if(value[kTAG_OBJECT] == selected_node_id){
      var node_id= value[kTAG_SUBJECT];
      var node_value= selected_node_data._node[node_id];
      select_node_direction='left';
      show_pager=true;
      show_search_filter= true;
      pager_count= pager_node_data_in_count;
    }else if(value[kTAG_SUBJECT] == selected_node_id){
      var node_id= value[kTAG_OBJECT];
      var node_value= selected_node_data._node[node_id];
      select_node_direction='right';
      show_pager=true;
      show_search_filter= true;
      pager_count= pager_node_data_out_count;
    }
    
    createNodeButton(
      layout,
      destination,
      getNodePredicate(value),
      getNodeName(node_value),
      getNodeCode(node_value),
      node_id,
      getNodeDescription(node_value),
      getNodeDefinition(node_value),
      getNodeKind(node_value),
      select_node_direction
    );
  });
  
  //startButtonListAnimation();
  
  if(show_pager===true){
    createPager(pager_count, destination);
  }
  
  if(show_search_filter===true){
    if(pager_count > 25){
      showSearchFilter(destination);
    
      if(start_search_bind===true){
        startSearchBind();
        start_search_bind=false;
      }
    }
  }
}

/**
 * This method group is used for reset the slider values
 *
 */
function resetSlider()
{
  //console.log('resetSlider');
  resetCenter();
  resetLeft();
  resetRight();
  resetPager();
  resetSearch();
}

function resetNodeList()
{
  //console.log('resetCenter');
  $('#'+slider_destination_search_node_list_point).html(' ');  
}

function resetCenter()
{
  //console.log('resetCenter');
  $('#'+slider_destination_center).html(' ');  
}

function resetLeft()
{
  //console.log('resetLeft');
  $('#'+slider_destination_left+' ul').html(' ');  
}

function resetRight()
{
  //console.log('resetRight');
  $('#'+slider_destination_right+' ul').html(' ');  
}

function resetSearch()
{
  $('.search_filter').fadeOut();
  $('.search_filter').val('');
}


/**
 * The following method are used to valorize the node data in the partials html slider
 *
 */
function createNodeMenuButton(layout, node_name, node_code, node_id)
{
  //console.log('createNodeMenuButton');
  //console.log(layout);
  $('#'+layout+' .node_record a').html(node_name);
  $('#'+layout+' .node_record a').attr('onclick', 'javascript: startNav('+node_id+');');
  //$('#'+layout+' .node_record a').attr('class', node_id);
  $('#'+slider_destination_root).append($('#nav_top_button .node_record').html());
}

function createNodeButton(layout, destination, predicate, node_name, node_code, node_id,node_description,node_definition, node_kind, direction)
{
  //console.log('createNodeButton');
  $('#'+layout+' .node_record .btn_node_predicate').html(predicate);
  $('#'+layout+' .node_record .btn_node_code').html(node_code);
  $('#'+layout+' .node_record .btn_node_name').html(node_name);
  $('#'+layout+' .node_record .btn_node_description').html(node_description);
  $('#'+layout+' .node_record .btn_node_definition').html(node_definition);
  $('#'+layout+' .node_record li').attr('id', 'row_'+node_id);
  $('#'+layout+' .node_record li').attr('style', 'display:none;');
  $('#'+layout+' .node_record .btn_node').attr('onclick', 'javascript: startBind('+node_id+',\''+predicate+'\',\''+direction+'\');');
  
  if(node_kind !== ''){
    var added_class= '';
    var divider=new RegExp(":");
    $.each(node_kind, function(key, value){
      if(divider.test(value))
        var html_class= value.replace(':', '');
      added_class += ' <span class="'+html_class+'" title=":'+html_class+'">■</span> ';
    });
    $('#'+layout+' .node_record .btn_node_code').html(node_code+added_class);
  }
    
  $('#'+destination+' ul.node_container').append($('#'+layout+' .node_record').html());
  $('#'+destination+' ul.node_container li').fadeIn('slow');
}

function displayNoResult()
{
  $('#'+slider_destination_search_node_list_point).append('<p>no node found</p>');
}

function createNodeList(node_class, node_nid, node_gid, node_label, node_kind)
{
  //console.log('createNodeMenuButton');
  $new_row= $('#'+slider_search_node_list_layout_id+' .node_record').clone();
  
  $new_row.find('li').addClass(node_class);
  $new_row.find('li').attr('onclick', 'javascript: startNav('+node_nid+');');
  $new_row.find('span.node_nid').html('NID '+node_nid);
  $new_row.find('span.node_label').html('LABEL '+node_label['en']);
  $new_row.find('span.node_gid').html('GID '+node_gid);
  
  if(node_kind !== undefined)
    $new_row.find('span.node_kind').html('KIND <br/>'+String(node_kind).replace(',','<br/>'));
  else
    $new_row.find('span.node_kind').html('');
  
  $('#'+slider_destination_search_node_list_point).append($($new_row).html());
}

function createNodeDetail()
{
  //console.log('createNodeDetail');
  $.each(selected_node_data._node[selected_node_id], function(arrayID,arrayValue) {
    if(arrayID !== '_id'){
      var label= selected_node_data._term[selected_node_data._tag[arrayID][kTAG_PATH][0]][kTAG_LABEL]['en'];
      if(arrayID == kTAG_LABEL){
        createNodeHeaderName(arrayValue['en']);
      }else if(arrayID == kTAG_GID){
        createNodeHeaderCode(checkArray(arrayValue));
      }else{
        $('#'+slider_center_layout_id+' .node_detail label' ).html(label);
        $('#'+slider_center_layout_id+' .node_detail span' ).html(checkArray(arrayValue));
        $('#'+slider_destination_center).append($('#'+slider_center_layout_id).html());
        $('#'+slider_center_layout_id+' .node_detail label' ).html('');
        $('#'+slider_center_layout_id+' .node_detail span' ).html('');
      }
    }
  });
  
  $('#'+slider_destination_center).fadeIn('slow');  
  $('#'+slider_destination_center_header).fadeIn('slow');
}

function createNodeHeaderName(node_name)
{
  //console.log('createNodeHeaderName');
  $('#'+slider_destination_center_header+' .btn_node_name').html(node_name);
}

function createNodeHeaderCode(node_code)
{
  //console.log('createNodeHeaderCode');
  $('#'+slider_destination_center_header+' .btn_node_code').html(node_code);
  
  if(selected_node_kind !== ''){
    var added_class= '';
    $.each(selected_node_kind, function(key, value){
      var html_class= value.replace(':', '');
      added_class += ' <span class="'+html_class+'" title=":'+html_class+'">■</span> ';
    });
    $('#'+slider_destination_center_header+' .btn_node_code').html(node_code+added_class);
  }
}

function checkArray(arrayValue)
{
  //console.log('checkArray');
  var node_partial='';
  
  if($.isArray(arrayValue)){
    $.each(arrayValue, function(key,value){
      node_partial +=checkArray(value)+'<br/>';
    });
    return (node_partial['en'])? node_partial['en']: node_partial;
  }
  
  if($.isPlainObject(arrayValue)){
    $.each(arrayValue, function(key,value){
      node_partial +='<strong>'+key+': </strong>'+checkArray(value)+'<br/>';
    });
    return (node_partial['en'])? node_partial['en']: node_partial;
  }
  
  return arrayValue;
}