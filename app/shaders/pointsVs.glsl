attribute vec4 lookup;

uniform sampler2D data;
uniform sampler2D fontTexture;
uniform vec2 dataRes;
uniform float scale;

varying vec4 color;

#define M_PI 3.1415926535897932384626433832795

// Description : Array and textureless GLSL 2D simplex noise function. Author : Ian McEwan, Ashima Arts. Maintainer : stegu Lastmod : 20110822 (ijm)
// License : Copyright (C) 2011 Ashima Arts. All rights reserved. Distributed under the MIT License. See LICENSE file. https://github.com/ashima/webgl-noise https://github.com/stegu/webgl-noise

vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

float snoise(vec2 v){
	const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
	vec2 i  = floor(v + dot(v, C.yy) );
	vec2 x0 = v -   i + dot(i, C.xx);
	vec2 i1;
	i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
	vec4 x12 = x0.xyxy + C.xxzz;
	x12.xy -= i1;
	i = mod289(i); // Avoid truncation effects in permutation
	vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));
	vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
	m = m*m ;
	m = m*m ;
	vec3 x = 2.0 * fract(p * C.www) - 1.0;
	vec3 h = abs(x) - 0.5;
	vec3 ox = floor(x + 0.5);
	vec3 a0 = x - ox;
	m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
	vec3 g;
	g.x  = a0.x  * x0.x  + h.x  * x0.y;
	g.yz = a0.yz * x12.xz + h.yz * x12.yw;
	return 130.0 * dot(m, g);
}

void main() {

	// vec4 c = texture2D( iChannel0, vUv );
	// float px = position.x + snoise( vec2( position.z, position.x  + time ) ) * modSize / 1.6 * ( 1.0 + spread );
	// float py = position.y + snoise( vec2( position.y + time, position.z ) ) * modSize / 1.6 * ( 1.0 + spread );

	// float rotation = snoise( vec2( py, px + time / 100.0 ) ) * M_PI * 2.0;
	// px += cos(rotation) * 10.0;
	// py += sin(rotation) * 10.0;

	vec3 p = vec3( position.xy * lookup.zw * scale, 0.0 );
	
	float lux = ( lookup.x + p.x / scale ) / dataRes.x;
	float luy = ( dataRes.y - ( lookup.y + lookup.w - p.y / scale ) ) / dataRes.y;
	color = texture2D( fontTexture, vec2( lux, luy ) );
	
	gl_PointSize = 1.0;
	gl_Position = projectionMatrix * modelViewMatrix * vec4( p, 1.0 );
}