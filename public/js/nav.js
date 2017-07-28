var obj=null;
var As=document.getElementById('nav').getElementsByTagName('a');
obj = As[0];
for(i=1;i<As.length;i++)
{if(window.location.href.indexOf(As[i].href)>=0)
obj=As[i];}
obj.id='nava'
// nav 
$('.m1').click(function(){
	$('.mobile-nav').slideToggle();
})
$('.m3').click(function(){
	$('.teamInfo').slideDown();
})
$('.closeInfo').click(function(){
	$('.teamInfo').fadeOut();
})