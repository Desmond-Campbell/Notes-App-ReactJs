<?php

namespace App\Services;

use Illuminate\Database\Eloquent\Model;
use GuzzleHttp\Client;

class Http extends Model
{
    
    public function get( $service, $uri, $payload, $extras = [] ) {

    	return $this->action( 'GET', $service, $uri, $payload, $extras );

    }

    public function post( $service, $uri, $payload, $extras = [] ) {

    	return $this->action( 'POST', $service, $uri, $payload, $extras );

    }

    public function action( $verb, $service, $uri, $payload, $extras = [] ) {

    	$headers = [];

    	$url = env( 'HTTP_ENDPOINT_' . strtoupper( $service ) ) . $uri;

    	$client = new Client( [ 'base_uri' => $url, 'http_errors' => false ] );

    	if ( $verb == 'POST' ) {
    		
    		$args = [ 'form_params' => $payload ];

    	} else {
    		
    		$url = $this->addParameters( $url, $payload );
    		$args = [];

    	}

    	$response = $client->request( $verb, $url, $args );
    	$result = (string) $response->getBody();

        file_put_contents("/var/www/notes/public/result.html", $result);

    	if ( json_decode( $result ) ?? null ) {

    		$result = json_decode( $result );

    	}

    	return $result;

    }

    public function addParameters( $url, $values ) {

    	$new_values = array_walk( $values, function ( &$value, $key ) { $value = "$key=" . urlencode( $value ); } );

    	$query_string = implode( '&', array_values( $values ) );

		$url .= stristr( $url, '?' ) ? '&' : '?';
		$url .= $query_string;

		return $url;

    }
	
}

