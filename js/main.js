/*  
	Scheme (Project Management Website)
	Author: Keila Bowers
*/

(function($){

/* ---- Accordion ---- */

$('#tabs p').hide().eq(0).show();
	$('#tabs p:not(:first)').hide(); /* Shows only the first time when page is loaded */

	/* When the tab is clicked is hides the previous <p> then finds and fades in <p> for tab clicked */
	$('#tabs-nav li').click(function(e) {
		e.preventDefault();
		$('#tabs p').hide();

	$('#tabs-nav .current').removeClass("current");
		$(this).addClass('current');
		var clicked = $(this).find('a:first').attr('href');

		$('#tabs |' + clicked).fadeIn('fast');

}).eq(0).addClass('current');



/* ---- Modal ---- */	

/* executes the css class that brings in overlay and popup box */
$('.modalClick').on('click', function(e) {
	e.preventDefault();
	$('#overlay').fadeIn().find('#modal').fadeIn();
	});

/* makes the X able to close out the modal */
$('.close').on('click', function(e) {
	e.preventDefault();
	$('#overlay').fadeOut().find('#modal').fadeOut();
	});

/* Status Fade: fades image by 50% when you put mouse on image and the second item returns to whole when mouse is removed */

$('.projectStatus').on('mouseover', function(){
	$(this).fadeTo(100, .5);
	});

$('.projectStatus').on('mouseout', function(){
	$(this).fadeTo(100, 1);
	});
	
/* ---- Add New Project ---- */

$('#addBtn').on('click', function() { //On click creates vars of data entered by user
	var projName = $('#projectName').val(),
		projDesc = $('#projectDescription').val(),
		projDue = $('#projectDueDate').val(),
		status = $('input[name="status"]:checked').prop('id');
		
	$.ajax({ //post info to .db using php file
		url: 'xhr/new_project.php',
		type: 'post',
		dataType: 'json',
		data: {
			projectName: projName,
			projectDescription: projDesc,
			dueDate: projDue,
			status: status
		},	
	
		success: function(response){ // Alerts of error  or sends to projects page if everything post okay
			if(response.error){
				alert(response.error);
			}else{ 
				window.location.assign('projects.html');
			};	
		}	
	});
});	


/* ---- Project List ---- */

var projects = function(){ //Defines var with a function 
	
	$.ajax({ //pulls projects from .db with php file (data fields selected below)
		url: 'xhr/get_projects.php',
		type: 'get',
		dataType: 'json',
		success: function(response){
			var resultsLength = response.projects.lenght 
			if(response.error){// Alerts of error if function doesn't complete
			  
			}else if($(resultsLength).length == 0) {
				$('.projects').append("No Current Projects")
				
			}else{
				//loops array information
				for(var i=0, j=response.projects.length; i < j; i++){
					var result = response.projects[i];
					
					//Adds the selected fields from .db to the html Projects class
					$('.projects').append( 
						'<div id="sort" class="ui-state-default">' +
						"<input class='projectid' type='hidden' value='" + result.id + "'>" + '</br>' +
						'<strong>Project Name: </strong>' + result.projectName + '</br>' +
						'Project Description: ' + result.projectDescription + '</br>' +
						'Project Due Date: ' + result.dueDate + '</br>' +
						'Project Status: ' + result.status + '</br>' +
						"<button type='button' class='delBtn'>Delete</button>" + '</div>' + '</br>'	);
					}
				
				
				$('.delBtn').on('click', function(e){ //on click function creates variable
					e.preventDefault();
					var resultid = $(this).parent().find('.projectid').val(); //makes it so you are getting the id of the actual project/parent instead of the btn itself
										
					$.ajax({ //then deletes selected project in .db with php file 
						url: 'xhr/delete_project.php',
						type: 'POST',
						dataType: 'json',
						data: {
							projectID: resultid,
						},
						success: function(response){ // Alerts of error  or sends to project page if everything post okay
							if(response.error){
								alert(response.error + 'please try again');
							}else{

								window.location.assign('projects.html');
							};
						}
					});
				});	// end of deleteBtn
					
			}		
		}
	});
}
projects();

/* ---- Datepicker ---- */

$('.mydatepicker').datepicker();

/* ---- Sorting ---- */

$('#sortJQ').sortable();
$('#sortJQ').disableSelection();

/* ---- Tooltips ---- */

/* Anything that has the masterTooltip class when hover it pulls title field from html and slowly fades to the body */
$('.masterTooltip').hover(function() {
	var title = $(this).attr('title');
		$(this).data('tipText', title).removeAttr('title');
		$("<p class='tooltip'></p>").text(title).appendTo('body').fadeIn('slow');
	}, 
	
	function() {
		$(this).attr('title', $(this).data('tipText'));
		$('.tooltip').remove();
	}).mousemove(function(e) { /* looks for page coordinates of field and then moves it over so the tool tip doesn't cover field*/ 
		var mousex = e.pageX + 20;
		var mousey = e.pageY + 10;
		$('.tooltip')
		.css({top: mousey, left: mousex})
	});

/* ---- Animate on Hover ---- */

/* selects images from the details section on the index.html then on hover it makes the image 25% larger at a slow steady pace */
$('#details img').hover(function(e){
	e.preventDefault();
	$(this).animate({'width': '25%', 'height':'25%'}, 'slow', 'linear');
	});
	
		
/* ---- Dynamic Buttons ---- */ //for all DynamicBtns html id when clicked is assign to its proper window
/* My Account */

$('#account').on('click', function(e){
	e.preventDefault();
	window.location.assign('account.html');
});

/* Projects */

$('#proj').on('click', function(e){
	e.preventDefault();
	window.location.assign('projects.html');
});

/* Dashboard */

$('#dashbd').on('click', function(e){
	e.preventDefault();
	window.location.assign('admin.html');
});



/* ---- Dynamic User Name Display ---- */

$.getJSON('xhr/check_login.php', function(data){ //pulls info and inserts in html class 
	$.each(data, function(key, val){
		$('.userid').html('Welcome User: ' + val.first_name);
	})
});

/* ---- My Account Changes ---- */
/* Still creating-Not functional
$('#changes').on('click', function(){
	var firstName= $('#fnameUpdate').val();
		lastName= $('#lnameUpdate').val();
		email= $('#emailUpdate').val();
		id= $(this).parent().find('id').val();
	
	$.ajax({
		url: 'xhr/update_user.php',
		type: 'post',
		dataType: 'json',
		data: {
			firstname: firstName,
			lastname:lastName,
			email: email,
			user: id,
		
		},
		
		success: function(response) {
			if (response.error){
				alert(response.error);
			}else{
				window.location.assign('account.html');
			}
		}
	});
}); */

/* ---- Register ---- */

$('#register').on('click', function(){ // on click it creates vars of data entered into fields
	var firstName= $('#fname').val();
		lastName= $('#lname').val();
		email= $('#email').val();
		username= $('#usernameReg').val();
		password= $('#passwordReg').val();
		confirm= $('#confirm').val();
		console.log('help')
	
	$.ajax({ // Post information to .db 
		url: 'xhr/register.php',
		type: 'post',
		dataType: 'json',
		data: {
			firstname: firstName,
			lastname:lastName,
			email: email,
			username: username,
			password: password
		
		},
		
		success: function(response) { // Alerts of error  or sends to admin page if everything post okay
			if (response.error){
				alert(response.error);
			}else{
				window.location.assign('admin.html');
			}
		}
	});
});





/* ---- Login ---- */

$('#signinButton').on('click', function(e){ //on click creates var for information entered into fields
	e.preventDefault();
	var username = $('#username').val();
	var password = $('#password').val();
	
	$.ajax({ // uses php file to confirm login information 
		url: 'xhr/login.php',
		type: 'post',
		dataType: 'json',
		data: {
			username: username,
			password: password,
		},
		
		success: function(response){ // Alerts of error  or sends to admin page if everything post okay
			if(response.error) {
				alert(response.error);
			}else{
			window.location.assign('admin.html')
			};
		}
	}); 
});
	

/* ---- Logout ---- */
//when clicked calls php logout function then sends to homepage
$('#logout').on('click', function(e){
	e.preventDefault();
	
	$.get('xhr/logout.php', function(){ 
		window.location.assign('index.html')
	})
	
});


})(jQuery); // end private scope




