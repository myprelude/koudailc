$("#theme").change(function() {
    $('.changeSelect').slideUp();
    acen_edit.setTheme($(this).val());
})
$("#fontsize").change(function() {
    $('.changeSelect').slideUp();
    acen_edit.setFontSize($(this).val());
}) 
$("#folding").change(function() {
    session.setFoldStyle($(this).val());
})
$("#select_style").change(function() {
    acen_edit.setOption("selectionStyle", this.checked ? "line" : "text");
})
$("#highlight_active").change(function() {
    acen_edit.setHighlightActiveLine(this.checked);
})
$("#soft_wrap").change(function() {
    acen_edit.setOption("wrap", $(this).val());
})
$("#show_print_margin").change(function() {
    acen_edit.renderer.setShowPrintMargin(this.checked);
})
var acen_edit = ace.edit('mdeditor'); 
acen_edit.setTheme('ace/theme/chrome');
acen_edit.getSession().setMode('ace/mode/markdown');
acen_edit.renderer.setShowPrintMargin(false);
$("#mdeditor").keyup(function() {
    console.log(acen_edit.getValue());
    $("#preview").html(marked(acen_edit.getValue()));
});
// 头部点击
$('#toolbar div').on('click',function(e){
    if($(e.target).closest(".changeSelect").length == 0){
        $(this).find('.changeSelect').slideToggle();
        $(this).siblings().find('.changeSelect').slideUp();
    }
    
})