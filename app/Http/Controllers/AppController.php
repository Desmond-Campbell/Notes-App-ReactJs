<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\Http;
use Auth;

class AppController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {

        $this->middleware('auth');
        $this->service_name = 'notes';
        $this->http = new Http;
        
    }

    /**
     * Show the application dashboard.
     *
     * @return \Illuminate\Contracts\Support\Renderable
     */
    public function index()
    {
        return view('app.editor');
    }

    public function get(Request $r){

        $id = $r->route('id');

        $payload = [];
        $payload['_id'] = $id;
        $payload['user_id'] = Auth::user()->id;

        $service_name = $this->service_name;
        $uri = '/notes/get';
        
        $response = $this->http->post( $service_name, $uri, $payload );

        if ( $response->stack[0] ?? null ) {
            $response->editorHtml = $response->stack[0];
        } else {
            $response->stack = [ '' ];
            $response->editorHtml = '';
        }

        return response()->json( $response );
    
    }

    public function delete(Request $r){

        $id = $r->route('id');
        
        $payload = [];
        $payload['_id'] = $id;
        $payload['user_id'] = Auth::user()->id;

        $service_name = $this->service_name;
        $uri = '/notes/delete';
        
        $response = $this->http->post( $service_name, $uri, $payload );

        return response()->json( $response );
    
    }

    public function getRecent(Request $r){

        $payload = [];
        $payload['user_id'] = Auth::user()->id;
        $payload['paging'] = [ 'limit' => 20, 
                                'sortField' => 'updated_at', 
                                'sortOder' => 'desc', 
                                'folder_id' => $r->input('query')['folder_id'] ?? null,
                                'keywords' => $r->input('query')['keywords'] ?? '' 
                            ];

        $service_name = $this->service_name;
        $uri = '/notes/browse';
        
        $notes = $this->http->post( $service_name, $uri, $payload )->notes ?? [];

        $payload = [];
        $payload['user_id'] = Auth::user()->id;

        $service_name = $this->service_name;
        $uri = '/notes/get-folders';
        
        $folders = $this->http->post( $service_name, $uri, $payload )->folders ?? [];

        foreach ( $folders as $folder ) {
            $folder->label = $folder->name;
            $folder->value = $folder->_id;
        }

        return response()->json( [ 'notes' => $notes, 'folders' => $folders ] );

    }

    public function browse(Request $r){

        $query = $r->input('query');

        $payload = [];
        $payload['user_id'] = Auth::user()->id;
        $payload['paging'] = [ 'limit' => 100, 
                                'sortField' => 'updated_at', 
                                'sortOder' => 'desc', 
                                'keywords' => $query['keywords'] ?? '' ,
                                'folder_id' => $query['folder_id'] ?? '' ,
                                'currentPage' => $query['currentPage'] ?? 1 
                            ];

        $service_name = $this->service_name;
        $uri = '/notes/browse';
        
        $notes = $this->http->post( $service_name, $uri, $payload );

        $payload = [];
        $payload['user_id'] = Auth::user()->id;

        $service_name = $this->service_name;
        $uri = '/notes/get-folders';
        
        $folders = $this->http->post( $service_name, $uri, $payload );

        foreach ( $folders->folders as $folder ) {
            $folder->label = $folder->name;
            $folder->value = $folder->_id;
        }

        return response()->json( [ 'notes' => $notes, 'folders' => $folders, 'query' => $notes->paging ] );

    }

    public function store(Request $r){
        
        $note = $r->input('note');
        $params = $r->input('params', []);
        $id = $params['note_id'] ?? ( $note['_id'] ?? null );

        $data = [];
        $data['_id'] = $id;
        $data['title'] = $note['title'] ?? null;
        $data['stack'] = $note['stack'] ?? [];
            if ( count( $data['stack'] ) < 1 ) $data['stack'] = [ '' ];
        $data['folder_id'] = $note['folder_id'] ?? null;
        $data['is_private'] = $note['is_private'] ?? false;
        $data['tags'] = $note['tags'] ?? false;

        if ( strtolower( $data['title'] ) == 'untitled note' && trim( strip_tags( $data['stack'][0] ) ) == '' && count( $data['stack'] ) == 1 ) {

            return response()->json( [ 'note' => [ 'title' => 'Untitled Note', 'editorHtml' => '', '_id' => null, 'message' => 'Original requested note not found. This is a new note.', 'stack' => [ '' ] ] ] );

        }

        $params['user_id'] = Auth::user()->id;

        $payload = [];
        $payload['data'] = $data;
        $payload['params'] = $params;

        $service_name = $this->service_name;
        $uri = '/notes/add';
        
        $response = $this->http->post( $service_name, $uri, $payload );

        if ( !$id && ( $response->note->_id ?? null ) ) $response->post_action = 'getNotes';

        if ( $response->note->stack[0] ?? null ) {
            $response->note->editorHtml = $response->note->stack[0];
        }

        return response()->json( $response );

    }

    public function createFolder(Request $r){
        
        $name = $r->input('name');

        $data = [];
        $data['_id'] = $r->folder_id;
        $data['name'] = $r->input('name') ?? null;

        if ( $data['name'] == '' ) {

            return response()->json( [ 'errors' => 'Name is required for folder.' ] );

        }

        $params['user_id'] = Auth::user()->id;

        $payload = [];
        $payload['data'] = $data;
        $payload['params'] = $params;

        $service_name = $this->service_name;
        $uri = '/notes/add-folder';
        
        $response = $this->http->post( $service_name, $uri, $payload );

        return response()->json( $response );

    }

}
