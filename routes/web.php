<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Auth::routes();

Route::get('/', 'AppController@index');
Route::get('/home', 'AppController@index')->name('home');
Route::get('/app', 'AppController@index');
Route::post('/api/notes/browse', 'AppController@browse');
Route::post('/api/notes/get-recent', 'AppController@getRecent');
Route::post('/api/notes/update', 'AppController@store');
Route::get('/api/notes/{id}/get', 'AppController@get');
Route::post('/api/notes/{id}/delete', 'AppController@delete');
Route::post('/api/notes/create-folder', 'AppController@createFolder');
Route::post('/api/notes/delete-folder', 'AppController@deleteFolder');
