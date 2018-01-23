module.exports = function( self ){
	self.addEventListener('message',function (msg){
		var data = JSON.parse( msg.data );
		self.postMessage( 'geoready' );
	});
}