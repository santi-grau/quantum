varying vec4 color;

void main() {
	vec3 col = vec3( 0.0 );
	float alpha = 0.0;
	if( color.a > 0.0 ) alpha = 1.0;

	gl_FragColor = vec4( col, alpha );
}