import './areainfo.html'


Template.areainfobody.onCreated(function(){
    var template = Template.instance();
    TemplateVar.set(template, 'areaForBidding', true);
    TemplateVar.set(template, 'ownedAsset', false);
});


Template.areainfobody.events({
	'click .bidding'(){
		 var template = Template.instance();
		 TemplateVar.set(template, 'areaForBidding', true);
    	 TemplateVar.set(template, 'ownedAsset', false);
	},
	'click .ownedAsset'(){
		var template = Template.instance();
		 TemplateVar.set(template, 'areaForBidding', false);
    	 TemplateVar.set(template, 'ownedAsset', true);
	}
})