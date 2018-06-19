$(document).ready( function() {
	var btt = $('.back-to-top');

	$(window).on('scroll',function(){
		var self  = $(this),
			height =  self.height(),
			top = self.scrollTop();
			
			if(top > height){
				if(!btt.is(':visible')){
					btt.show();
				}
			}	else {
				btt.hide();
			}
	});
});