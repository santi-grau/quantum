attribute vec4 lookup; // x, y, w, h
attribute float offset; // yoffset

uniform sampler2D fontTexture;
uniform vec2 fontTexRes;
uniform vec4 dimensions; // base, padding-left, padding-bottom, scale

varying vec4 color;

void main() {
	vec3 p = vec3( position.xy * lookup.zw * dimensions.w, 0.0 );
	p.x -= dimensions.y * dimensions.w;
	p.y *= -1.0;
	p.y -= (offset - dimensions.x - dimensions.z) * dimensions.w;
	
	float lux = ( lookup.x + position.x * lookup.z ) / fontTexRes.x;
	float luy = ( fontTexRes.y - ( lookup.y + position.y * lookup.w ) ) / fontTexRes.y;
	color = texture2D( fontTexture, vec2( lux, luy ) );
	
	gl_PointSize = 1.0;
	gl_Position = projectionMatrix * modelViewMatrix * vec4( p, 1.0 );
}