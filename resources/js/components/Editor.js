import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import axios from 'axios';

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Select, { components } from 'react-select';
import Parser from 'html-react-parser';

var timer, timer1;

function insertStar () {
  const cursorPosition = this.quill.getSelection().index
  this.quill.insertText(cursorPosition, "★")
  this.quill.setSelection(cursorPosition + 1)
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function isMobile() {
  var check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
};

const Checkbox = props => (
  <input type="checkbox" {...props} />
)

const CustomButton = () => <span className="octicon octicon-star">*</span>
;

const CustomToolbar = () => (
  <div id="toolbar">
    <select className="ql-header" defaultValue={""} onChange={e => e.persist()}>
      <option value="1"></option>
      <option value="2"></option>
      <option selected></option>
    </select>
    <button className="ql-bold"></button>
    <button className="ql-italic"></button>
    <select className="ql-color">
      <option value="red"></option>
      <option value="green"></option>
      <option value="blue"></option>
      <option value="orange"></option>
      <option value="violet"></option>
      <option value="#d0d1d2"></option>
      <option selected></option>
    </select>
    <button className="ql-insertStar">
      <CustomButton />
    </button>
  </div>
)
;

const Menu = () => (
    <div>
    </div>
);

const resetTimeout = (id, newID) => {
    
    clearTimeout(id)
    return newID
    
};

const SaveMessage = ({visible}) => <span className={'saved' + (visible ? ' saved-visible' : '')}>* &nbsp;</span>
;

class SideBar extends React.Component {

    constructor (props) {
        
        super(props);
        this.state = { 
                        notes: [],
                        folders: [],
                        query: { keywords: '', folder_id: null },
                        currentFolder: { _id: null, name: 'All Notes' },
                        currentSidebarView: 'notes',
                        new_folder: '',
                        createFolderMode: 'create'
                    };
        this.search = this.search.bind(this);
        timer1 = setInterval( () => { this.getNotes(null); }, 30000 );

    }

    loader(mode) {
        if ( !mode ) {
            jQuery('#main').css('filter', 'alpha(opacity=100)').css('opacity', '1');
            jQuery('#loader').hide();
        } else {
            jQuery('#main').css('filter', 'alpha(opacity=60)').css('opacity', '0.6');
            jQuery('#loader').show();
        }
    }

    search(e){
        if(e.keyCode == 13 && e.target.value.length){
            this.loader(1);
            this.setQuery(e.target.value);
            this.getNotes({...this.state.query, keywords: e.target.value});
        }
    }

    handleCreateFolder(e){
        if(e.keyCode == 13 && e.target.value.length){
            this.createFolder(this.state.new_folder);
        }
    }

    isBottom(el) {
      return el.getBoundingClientRect().bottom <= window.innerHeight;
    }

    trackScrolling () {
      const wrappedElement = document.getElementById('sidebar');
      /*if (this.isBottom(wrappedElement)) {
        console.log('sidebar bottom reached');
        document.removeEventListener('scroll', this.trackScrolling);
      }*/
    }

    componentDidMount() {
        
        this.getNotes('');
        document.addEventListener('scroll', this.trackScrolling);

    }

    componentWillUnmount() {
      document.removeEventListener('scroll', this.trackScrolling);
    }

    setQuery (keywords) {

        this.setState({...this.state, query: {...this.state.query, keywords: keywords}});

    }

    async getNotes ( query ) {

        if ( typeof query === 'null' ) {
            query = this.state.query;
        }

        axios.post('/api/notes/get-recent', { query: query, params: { tested: true } })
          .then(response => {
            this.loader(0);
            const notes = response.data.notes;
            const folders = response.data.folders;
            this.setState({...this.state, notes: notes, folders: folders});
        });

    }

    async createFolder ( name, element, mode ) {

        this.loader(1);
        
        var payload = { name: name };

        if ( this.state.createFolderMode == 'edit' ) {
            payload._id = this.state.currentFolder._id;
            payload.mode = 'edit';
        }

        axios.post('/api/notes/create-folder', payload)
          .then(response => {
            this.loader(0);
            var folders = this.state.folders;
            if ( typeof response.data.folders !== 'undefined' ) {
                folders = response.data.folders.folders;
            }
            this.setState({...this.state, new_folder: '', createFolderMode: 'create', folders: folders}, function(){
                this.changeSidebarView('notes');
            });
            jQuery('new_folder').val('');
        });

    }

    editNote (id) {
        E.editNote(id);
    }

    editFolder() {
        this.setState({...this.state, createFolderMode: 'edit'},
            function() {
                this.changeSidebarView('create-folder');
        });
    }

    deleteFolder() {

        if ( !confirm('Delete this folder? The notes will be transferred to your default folder.') ) return;

        var payload = { _id: this.state.currentFolder._id };

        axios.post('/api/notes/delete-folder', payload)
          .then(response => {
            this.loader(0);
            var folders = this.state.folders;
            if ( typeof response.data.folders !== 'undefined' ) {
                folders = response.data.folders.folders;
            }
            this.setState({...this.state, new_folder: '', folders: folders, currentFolder: {_id: null, name: 'All Notes'}}, function() {
                this.getNotes(null);
                this.changeSidebarView('notes');
            });
        });

    }

    toggleLayout () {
        E.toggleLayout();
    }

    changeSidebarView(view) {
        this.setState({...this.state, currentSidebarView: view});
    }

    filterByFolderSidebar(folder) {
        const query = this.state.query;
        this.setState({...this.state, currentFolder: folder, currentSidebarView: 'notes', query: {...this.state.query, folder_id: folder._id}});
        this.getNotes({ folder_id: folder._id, keywords: query.keywords });
    }
  
    render () {
        return (
            <div id="sidebar">

                { this.state.currentSidebarView == 'notes' &&
                
                <div>

                    <div className="input-group mb-3">
                        <div className="input-group-prepend">
                            <span className="input-group-text" id="btn-grp-1" onClick={() => this.toggleLayout()}>
                                <i className="fa fa-times"></i>
                            </span>
                        </div>
                        <input type="text" 
                            className="form-control" 
                            defaultValue={this.state.query.keywords} 
                            onKeyDown={e => this.search(e)}
                            aria-label="" 
                            aria-describedby="btn-grp-1"
                            autoComplete="off"
                        />
                    </div>

                    <div className="push-down">
                        <label className="clickable">
                            <big>
                                <a href="#!" onClick={() => this.changeSidebarView('folders')} style={{color: '#131313'}}>
                                    <strong>{this.state.currentFolder.name}</strong>
                                </a>
                            </big> &nbsp; 
                            <a href="#!" onClick={() => this.getNotes({})}><i className="fas fa-sync-alt"></i></a>  &nbsp; 
                            { this.state.currentFolder._id && 
                            <span>
                                <a href="#!" onClick={() => this.editFolder()} style={{color: '#333231'}}><i className="fas fa-edit"></i></a>  &nbsp; 
                                <a href="#!" onClick={() => this.deleteFolder()} style={{color: '#700c0c'}}><i className="fa fa-trash"></i></a> &nbsp;  
                            </span> }
                        </label>
                    </div>

                    <div className="push-down">

                        <ul className="sidebar-list">
                            {this.state.notes.map( item => {
                                return (
                                    <li key={item._id} onClick={() => this.editNote(item._id)}>
                                        <label className="list-item-title">{item.title}</label>
                                        <label className="list-item-subtitle">{item.updated_at}</label>
                                    </li>
                                )
                            })}
                        </ul>
                    </div>

                </div> }

                { this.state.currentSidebarView == 'folders' &&

                <div className="push-down">

                    <button className="btn btn-primary btn-md" title="Back to notes" onClick={() => this.changeSidebarView('notes')}>
                        <i className="fa fa-reply"></i>
                    </button>

                    <div className="push-down">
                        <label className="clickable">
                            <big>
                                Current Folder: <br />
                                <strong>{this.state.currentFolder.name}</strong> &nbsp;
                                <a href="#!" title="Create a Folder" onClick={() => this.changeSidebarView('create-folder')}>
                                    <i className="fa fa-plus-circle"></i>
                                </a>
                            </big>
                        </label>
                    </div>
                
                    <ul className="sidebar-list push-down">

                        <li onClick={() => this.filterByFolderSidebar({_id: null, name: 'All Notes'})}>
                            <label className="list-item-title">All Notes</label>
                            <label className="list-item-subtitle">0</label>
                        </li>

                        {this.state.folders.map( item => {
                            return (
                                <li key={item._id} onClick={() => this.filterByFolderSidebar(item)}>
                                    <label className="list-item-title">{item.name}</label>
                                    <label className="list-item-subtitle">{item.counter}</label>
                                </li>
                            )
                        })}
                    </ul>

                </div> }

                { this.state.currentSidebarView == 'create-folder' &&

                <div className="push-down">

                    <button className="btn btn-primary btn-md" title="Back to notes" onClick={() => this.changeSidebarView('folders')}>
                        <i className="fa fa-reply"></i>
                    </button>

                    <div className="form-group">
                        <label><strong>Type a new folder name:</strong></label>
                    </div>

                    <div className="push-down form-group">
                        <div className="input-group mb-3">
                            <input type="text" 
                                className="form-control" 
                                defaultValue={this.state.new_folder} 
                                onKeyDown={e => this.handleCreateFolder(e)}
                                onChange={e => { this.state.new_folder = e.target.value }}
                                aria-label="" 
                                aria-describedby="btn-grp-2"
                                autoComplete="off"
                            />

                            <div className="input-group-append">
                                <span className="input-group-text" id="btn-grp-2" onClick={() => this.createFolder(this.state.new_folder)}>
                                    <i className="fa fa-check"></i>
                                </span>
                            </div>
                        </div>
                    </div>

                </div> }

            </div>
        )
    }

}

class Editor extends React.Component {
    
    constructor (props) {
        
        super(props);

        this.state = { 
                        note: {
                            _id: null,
                            folder_id: null,
                            editorHtml: '',
                            title: '',
                            stack: [ '' ]
                        },
                        browse: {
                            query: { keywords: '', folder_id: null, currentPage: 1, pageCount: 1 }
                        },
                        notes: [],
                        folders: [],
                        currentView: 'note',
                        currentSubView: 'editor',
                        editTitleMode: 'editing',
                        theme: 'snow', 
                        page: 1, 
                        timeout: null,
                        saved: false,
                        lastsaved: 0,
                        expanded: 'expanded',
                        screenMode: 'normal',
                        toolbarViewMode: 1
                    };

        this.handleChange = this.handleChange.bind(this);

    }

    isNull(value) {
        return typeof value === 'null';
    }

    loader(mode) {
        if ( !mode ) {
            jQuery('#main').css('filter', 'alpha(opacity=100)').css('opacity', '1');
            jQuery('#loader').hide();
        } else {
            jQuery('#main').css('filter', 'alpha(opacity=60)').css('opacity', '0.6');
            jQuery('#loader').show();
        }
    }

    componentDidMount() {
        
        this.editNote(null);
        this.getNotes({});

        if ( isMobile() ) {
            this.toggleLayout();
        }

        timer = setInterval( () => { this.updateNote({force: true}); }, 10000 );

    }

    toggleLayout() {

        const expanded = this.state.expanded;

        var new_expanded_state = expanded == 'expanded' ? 'collapsed' : 'expanded';

        this.setState({...this.state, expanded: new_expanded_state});

    }
  
    handleChange (html) {
        
        const page = this.state.page;
        const stack = this.state.note.stack;

        var new_stack = stack;
        new_stack[page-1] = html;

        this.setState({...this.state, updated: true, note: {...this.state.note, editorHtml: html, stack: new_stack}, timeout: resetTimeout(this.state.timeout, setTimeout(this.updateNote({}), 10000))});

    }

    updateInput (target, value) {
        
        const note = this.state.note;

        var new_note = note;
        new_note[target] = value;

        this.setState({...this.state, note: new_note});

    }

    editNote (note_id) {
        
        var defaultMode = 'editor';

        if ( isMobile() ) {
            this.toggleLayout();
        }

        if ( note_id ) {
            defaultMode = 'read';
        }

        if ( !note_id ) {

            note_id = 0;

        }
        
        this.setState({...this.state, note: {...this.state.note, _id: note_id}});

        this.loader(1);
        axios.get('/api/notes/' + `${note_id}/get`)
          .then(response => {
            this.loader(0);
            const result = response.data;
            var editMode = result.title != '' && result.title != 'Untitled Note' ? 'viewing' : 'editing';
            this.setState({...this.state, note_id: result._id, editTitleMode: editMode, currentView: 'note', currentSubView: defaultMode, note: {...this.state.note, editorHtml: result.stack[0], ...result}});
        });

    }

    async updateNote ( options ) {

        const note = this.state.note;
        const updated = this.state.updated;
        const lastsaved = this.state.lastsaved;
        
        if ( !updated /*&& !options.force*/ ) {

            if ( options.new ) {
                this.addNote();
            }

            if ( options.browse ) {
                this.changeView('browse');
            }

            return;

        }
        
        var currenttime = Math.floor(Date.now() / 1000);
        var diff = currenttime - lastsaved;

        if ( diff > 30 || options.force ) {

            axios.post('/api/notes/update', { note: note, params: { note_id: this.state.note_id } })
              .then(response => {
                
                this.loader(0);
                
                this.setState({...this.state, updated: false, saved: true, lastsaved: currenttime})
                setTimeout(() => this.setState({...this.state, saved: false}), 10000);

                if ( typeof response.data.post_action !== 'undefined' ) {

                    var post_action = response.data.post_action;

                    if ( post_action == 'getNotes' ) {

                        this.getNotes({});
                        this.setState({...this.state, note: response.data.note, note_id: response.data.note._id});

                    }

                }

                if ( options.browse ) {
                    this.changeView('browse');
                }

                if ( options.new ) {
                    this.addNote();
                }

            });

        } else {

            // setTimeout(() => this.updateNote(), 30 - diff);

        }

    }
  
    async deleteNote ( id ) {

        if ( !confirm( 'Delete this note permanently?' ) ) return;

        this.loader(1);
        
        axios.post('/api/notes/' + `${this.state.note_id}/delete`, {})
          .then(response => {
            this.loader(0);
            if ( typeof response.data.errors !== 'undefined' ) {
                alert( response.data.errors );
            } else {
                this.addNote()
            }
        });

    }

    addNote () {

        this.setState({...this.state, note_id: null, editTitleMode: 'editing', currentView: 'note', currentSubView: 'editor', page: 1, note: { title: 'Untitled note', editorHtml: '', stack: ['']}});

    }
  
    nextPage () {
        
        const stack = this.state.note.stack;
        const page = this.state.page;
        const html = this.state.note.editorHtml;
        
        var new_stack = [...stack];
        new_stack[page-1] = html;

        if ( stack.length == page ) {
            var new_html = '';
            new_stack.push('');
        } else {
            var new_html = stack[page];
        }

        var new_page = page + 1;

        this.setState({...this.state, page: new_page, note: {...this.state.note, editorHtml: new_html, stack: new_stack }});

    }

    previousPage () {
        
        const stack = this.state.note.stack;
        const page = this.state.page;
        const html = this.state.note.editorHtml;

        var new_stack = [...stack];
        new_stack[page-1] = html;

        if ( page > 1 ) {
            var new_html = stack[page-2];
            var new_page = page - 1;
            this.setState({...this.state, page: new_page, note: {...this.state.note, editorHtml: new_html, stack: new_stack}});
        } else {
            console.log('We are on the first page...');
        }

    }
 
    deletePage () {

        if ( !confirm('Sure?') ) return;
        
        const stack = this.state.note.stack;
        const page = this.state.page;

        if ( stack.length < 2 ) {

            var new_html = '';
            var new_page = 1;
            this.setState({...this.state, page: new_page, note: {...this.state.note, editorHtml: new_html, stack: stack }});

        } else {

            var new_stack = [...stack];
            new_stack.splice( page-1, 1 );

            var new_page = Math.max( 1, page - 1 );
            var new_html = new_stack[new_page-1];
            this.setState({...this.state, page: new_page, note: {...this.state.note, editorHtml: new_html, stack: new_stack}});

        }

    } 

    changeView (page) {
        
        this.setState({...this.state, currentView: page});

    }

    changeSubView (view) {
        
        this.setState({...this.state, currentSubView: view});

    }

    search(e) {
        if(e.keyCode == 13 && e.target.value.length){
            this.loader(1);
            this.getNotes({...this.state.browse.query, keywords: e.target.value});
        }
    }

    editTitle() {
        this.setState({...this.state, editTitleMode: 'editing'});
        // setTimeout(document.getElementById('note_title').focus(), 500);
        /*ToDo: use refs to get this element*/
    }

    saveTitle(e) {
        if(e.keyCode == 13 && e.target.value.length){
            this.setState({...this.state, updated: true, editTitleMode: 'viewing'});
        }
    }

    browsePage (delta) {

        const query = this.state.browse.query;
        var new_query = {...query, currentPage: Math.min( Math.max(0, query.currentPage + delta), query.pageCount )};
        this.setState({...this.state, browse: {...this.state.browse, query: new_query}});
        this.getNotes( new_query );

    }

    async getNotes ( query ) {

        if ( typeof query === 'null' ) {
            query = this.state.browse.query;
        }

        axios.post('/api/notes/browse', { query: query, params: { tested: true } })
          .then(response => {
            this.loader(0);
            const notes = response.data.notes.notes;
            const folders = response.data.folders.folders;
            const query = response.data.query;
            this.setState({...this.state, notes: notes, folders: folders, browse: {...this.state.browse, query: query}});
        });

    }

    filterByFolder(folder_id) {
        const query = this.state.browse.query;
        this.setState({...this.state, browse: {...this.state.browse, query: {...this.state.browse.query, folder_id: folder_id}}});
        this.getNotes({ folder_id: folder_id, keywords: query.keywords });
    }

    checkBoxHandler ( field ) {
        const checked = this.state.note[field];
        var new_checked_status = !checked;
        var new_state = {...this.state};
        new_state.note[field] = new_checked_status;
        this.setState(new_state);
    }

    handleChangeFolder(e) {
        this.setState({...this.state, updated: true, note: {...this.state.note, folder_id: e.value}});
        this.updateNote({});
    }

    readNote () {

        this.setState({...this.state, currentSubView: 'read', expanded: 'collapsed', editTitleMode: 'viewing'});

    }

    backToEditMode () {

        this.setState({...this.state, currentSubView: 'editor', expanded: 'expanded'});

    }

    simpleView () {

        this.setState({...this.state, expanded: 'collapsed', editTitleMode: 'viewing', screenMode: 'simple'});
        jQuery('#top-nav').hide();
        jQuery('.ql-toolbar').hide();
        jQuery('.normal-view').hide();
        jQuery('.simple-view').show();

    }

    normalView () {

        this.setState({...this.state, expanded: 'expanded', editTitleMode: 'viewing', screenMode: 'normal'});
        jQuery('#top-nav').show();
        jQuery('.ql-toolbar').show();
        jQuery('.normal-view').show();
        jQuery('.simple-view').hide();

        if ( isMobile() ) {
            this.toggleLayout();
        }

    }

    switchToolbarMode () {
        /*var toolbarViewMode = this.state.toolbarViewMode;

        if ( toolbarViewMode == 2 ) {
            jQuery('.ql-toolbar').show();
            toolbarViewMode = 1;
        } else {
            jQuery('.ql-toolbar').hide();
            toolbarViewMode = 2;
        }

        this.setState({...this.state, toolbarViewMode: toolbarViewMode});*/

        jQuery('.ql-toolbar').slideToggle();

    }

    render () {
        return (
            <div>

                { this.state.currentView == 'browse' &&
                
                <div className="row">

                    <div id="sidebar" className="col-md-3">

                        <h3>Folders</h3>

                        <ul className="sidebar-list">
                            {this.state.folders.map( item => {
                                return (
                                    <li key={item._id} onClick={() => this.filterByFolder(item._id)}>
                                        <label className="list-item-title">{item.name}</label>
                                        <label className="list-item-subtitle">{item.counter}</label>
                                    </li>
                                )
                            })}
                        </ul>

                    </div>

                    <div className="col-md-9">

                        <div className="page-toolbar">
                            <button className="btn btn-md btn-default" onClick={() => this.updateNote({force: true, new: true})}>
                                <i className="fa fa-plus"></i>
                            </button>
                            <button className="btn btn-md btn-default" onClick={() => this.changeView('note')}>
                                <i className="fa fa-reply"></i>
                            </button>
                            <button className="btn btn-md btn-default" onClick={() => this.browsePage(-1)}>
                                <i className="fa fa-chevron-left"></i>
                            </button>
                            Showing {this.state.browse.query.currentPage} of {this.state.browse.query.pageCount}
                            <button className="btn btn-md btn-default" onClick={() => this.browsePage(1)}>
                                <i className="fa fa-chevron-right"></i>
                            </button>
                        </div>

                        <div className="form-group push-down">

                            <div className="input-group mb-3">
                                <div className="input-group-prepend">
                                    <span className="input-group-text" id="btn-grp-3">
                                       <a href="#!" onClick={() => this.getNotes(null)}><i className="fas fa-sync-alt"></i></a>
                                    </span>
                                </div>
                                <input type="text" 
                                    className="form-control" 
                                    defaultValue={this.state.browse.query.keyword} 
                                    onKeyDown={e => this.search(e)} 
                                    autoComplete="off"
                                    aria-label="" 
                                    aria-describedby="btn-grp-3"
                                />
                            </div>
                            
                        </div>

                            


                        <div className="push-down">

                            <div className="row list-grid">

                                {this.state.notes.map( item => {
                                    return (
                                        <div key={item._id} className="col-md-3 grid-node" onClick={() => { this.changeView('note'); this.editNote(item._id); }}>
                                            <label className="grid-node-title">{item.title}</label>
                                            <label className="grid-node-subtitle">
                                                <span className="grid-node-folder-name">{item.folder_name}</span>
                                                <span className="grid-node-date">{item.updated_at}</span>
                                            </label>
                                        </div>
                                    )
                                })}

                            </div>

                        </div>

                    </div>

                </div> }

                { this.state.currentView == 'note' &&
                <div className="row">

                    <div className={ this.state.expanded == 'expanded' ? 'col-md-3' : 'hidden'}>
                        <SideBar />
                    </div>

                    <div className={ this.state.expanded == 'expanded' ? 'col-md-9' : 'col-md-12'}>

                        <div className="editor-title-container">
                            { 
                                ( this.state.editTitleMode == 'editing' || this.state.editTitleMode == 'viewing' ) && 
                                
                                <div>

                                    <input 
                                        type="text" 
                                        title="Search notes by keywords"
                                        className="form-control" 
                                        onChange={e => this.updateInput("title", e.target.value)}
                                        value={this.state.note.title}
                                        onKeyDown={ e => this.saveTitle(e)}
                                        onBlur={ e => this.saveTitle(e)}
                                        id="note_title"
                                        autoComplete="off"
                                    />

                                </div> }
                            { 
                                this.state.editTitleMode == 'OBSOLETE' && 
                                <h2 className="note-title clickable" onClick={() => this.editTitle()}>
                                    <SaveMessage visible={!this.state.saved} />
                                    {this.state.note.title}
                                </h2>
                            }
                        </div>
                        

                        { this.state.currentSubView == 'editor' &&
                        
                        <div id="main-toolbar">
                            <div className="page-toolbar push-down normal-view">
                                { 
                                    this.state.expanded == 'expanded' && 
                                    <button className="btn btn-primary btn-md btn-toolbar" title="Hide sidebar" onClick={() => this.toggleLayout()}>
                                        <i className="fa fa-chevron-left"></i>
                                    </button> 
                                }
                                { 
                                    this.state.expanded == 'collapsed' && 
                                    <button className="btn btn-primary btn-md btn-toolbar" title="Show sidebar" onClick={() => this.toggleLayout()}>
                                        <i className="fa fa-chevron-right"></i>
                                    </button> 
                                }
                                <button className="btn btn-default btn-md btn-toolbar" title="Toolbar Mode" onClick={() => this.switchToolbarMode()}>
                                    <i className="fas fa-palette"></i>
                                </button>
                                <button className="btn btn-default btn-md btn-toolbar" title="New note" onClick={() => this.updateNote({force: true, new: true})}>
                                    <i className="fa fa-plus"></i>
                                </button>
                                <button className="btn btn-default btn-md btn-toolbar" title="Browse notes" onClick={() => this.changeView('browse')}>
                                    <i className="fa fa-list"></i>
                                </button>
                                <button className="btn btn-default btn-md btn-toolbar" title="Go to previous page" onClick={() => this.previousPage()}>
                                    <i className="fa fa-arrow-left"></i>
                                </button>
                                {this.state.page}/{this.state.note.stack.length}
                                <button className="btn btn-default btn-md btn-toolbar" title="Go to next page" onClick={() => this.nextPage()}>
                                    <i className="fa fa-arrow-right"></i>
                                </button>
                                <button className="btn btn-default btn-md btn-toolbar" title="Delete this page" onClick={() => this.deletePage()}>
                                    <i className="fa fa-times"></i>
                                </button>
                                <button className="btn btn-default btn-md btn-toolbar" title="Save" onClick={() => this.updateNote({force: true})}>
                                    <i className="fa fa-check"></i>
                                </button>
                                <button className="btn btn-default btn-md btn-toolbar" title="Save and exit" onClick={() => this.updateNote({force: true, browse: true})}>
                                    <i className="fa fa-check-double"></i>
                                </button>
                                <button className="btn btn-default btn-md btn-toolbar" title="Delete this note" onClick={() => this.deleteNote()}>
                                    <i className="fa fa-trash"></i>
                                </button>
                                <button className="btn btn-default btn-md btn-toolbar" title="Read mode" onClick={() => this.readNote()}>
                                    <i className="fab fa-readme"></i>
                                </button>
                                <button className="btn btn-default btn-md btn-toolbar" title="Simple view" onClick={() => this.simpleView()}>
                                    <i className="fas fa-expand"></i>
                                </button>
                                <button className="btn btn-default btn-md btn-toolbar" title="Note properties" onClick={() => this.changeSubView('properties')}>
                                    <i className="fa fa-sliders-h"></i>
                                </button>
                                
                            </div>
                            <div className="page-toolbar push-down simple-view">
                                <button className="btn btn-default btn-md btn-toolbar" title="Toolbar Mode" onClick={() => this.switchToolbarMode()}>
                                    <i className="fas fa-palette"></i>
                                </button>
                                <button className="btn btn-default btn-md btn-toolbar" title="New note" onClick={() => this.updateNote({force: true, new: true})}>
                                    <i className="fa fa-plus"></i>
                                </button>
                                <button className="btn btn-default btn-md btn-toolbar" title="Go to previous page" onClick={() => this.previousPage()}>
                                    <i className="fa fa-arrow-left"></i>
                                </button>
                                {this.state.page}/{this.state.note.stack.length}
                                <button className="btn btn-default btn-md btn-toolbar" title="Go to next page" onClick={() => this.nextPage()}>
                                    <i className="fa fa-arrow-right"></i>
                                </button>
                                <button className="btn btn-default btn-md btn-toolbar" title="Save" onClick={() => this.updateNote({force: true})}>
                                    <i className="fa fa-check"></i>
                                </button>
                                <button className="btn btn-default btn-md btn-toolbar" title="Read mode" onClick={() => this.readNote()}>
                                    <i className="fab fa-readme"></i>
                                </button>
                                <button className="btn btn-default btn-md btn-toolbar" title="Normal view" onClick={() => this.normalView()}>
                                    <i className="fas fa-compress-arrows-alt"></i>
                                </button>
                            </div>
                            <div className="push-down editor-container">
                                <ReactQuill 
                                    theme={this.state.theme}
                                    onChange={this.handleChange}
                                    value={this.state.note.editorHtml}
                                    modules={Editor.modules}
                                    formats={Editor.formats}
                                    bounds={'.app'}
                                    placeholder={this.props.placeholder}
                                />
                            </div>
                            <br />
                            <hr />
                        </div> }

                        { this.state.currentSubView == 'properties' &&

                        <div className="push-down">
                            <h3 className="page-section-title">
                                <button className="btn btn-primary btn-md" title="Back to editor" onClick={() => this.changeSubView('editor')}>
                                    <i className="fa fa-reply"></i>
                                </button> &nbsp;
                                Note Settings
                            </h3>

                            <hr />

                            <div className="form-group">
                                <label className="label"><strong>Folder</strong></label>
                                <Select
                                    className="col-md-6"
                                    options={this.state.folders.filter(item => !this.isNull(item._id))}
                                    defaultValue={this.state.note.folder}
                                    onChange={(e) => this.handleChangeFolder(e)}
                                 />
                            </div>

                            <div className="form-group">
                                <div>
                                    <label className="label"><strong>Privacy</strong></label>
                                </div>
                                <label className="push-down">
                                    <input type="checkbox"
                                        onChange={e => this.checkBoxHandler('is_private')}
                                        checked={this.state.note.is_private}
                                        value="1"
                                    />
                                    <label onClick={e => this.checkBoxHandler('is_private')}>&nbsp; This is a private note</label>
                                </label>
                            </div>

                            <div className="form-group">
                                <button className="btn btn-success btn-md" title="Save Note" onClick={() => { this.updateNote({}); this.changeSubView('editor');}}>
                                    <i className="fa fa-check"></i> Save Note
                                </button>
                            </div>

                        </div>

                        }

                        { this.state.currentSubView == 'read' &&
                        
                        <div id="main-toolbar read-container">
                            <div className="page-toolbar push-down">
                                { 
                                    this.state.expanded == 'expanded' && 
                                    <button className="btn btn-primary btn-md btn-toolbar" title="Hide sidebar" onClick={() => this.toggleLayout()}>
                                        <i className="fa fa-chevron-left"></i>
                                    </button> 
                                }
                                { 
                                    this.state.expanded == 'collapsed' && 
                                    <button className="btn btn-primary btn-md btn-toolbar" title="Show sidebar" onClick={() => this.toggleLayout()}>
                                        <i className="fa fa-chevron-right"></i>
                                    </button> 
                                }
                                <button className="btn btn-default btn-md btn-toolbar" title="New note" onClick={() => this.updateNote({force: true, new: true})}>
                                    <i className="fa fa-plus"></i>
                                </button>
                                <button className="btn btn-default btn-md btn-toolbar" title="Browse notes" onClick={() => this.changeView('browse')}>
                                    <i className="fa fa-list"></i>
                                </button>
                                <button className="btn btn-default btn-md btn-toolbar" title="Delete this note" onClick={() => this.deleteNote()}>
                                    <i className="fa fa-trash"></i>
                                </button>
                                <button className="btn btn-default btn-md btn-toolbar" title="Edit mode" onClick={() => this.backToEditMode()}>
                                    <i className="fas fa-edit"></i>
                                </button>
                                { this.state.screenMode == 'normal' &&
                                <button className="btn btn-default btn-md btn-toolbar" title="Simple view" onClick={() => this.simpleView()}>
                                    <i className="fas fa-expand"></i>
                                </button> }
                                { this.state.screenMode == 'simple' &&
                                <button className="btn btn-default btn-md btn-toolbar" title="Normal view" onClick={() => this.normalView()}>
                                    <i className="fas fa-compress-arrows-alt"></i>
                                </button> }
                                <button className="btn btn-default btn-md btn-toolbar" title="Note properties" onClick={() => this.changeSubView('properties')}>
                                    <i className="fa fa-sliders-h"></i>
                                </button>
                            </div>
                        </div> }

                        { this.state.currentSubView == 'read' &&
                        <div className="row">

                            <div className="col-md-12">

                                {this.state.note.stack.map( item => {
                                    return (
                                        <div key={item} className="">
                                            {Parser(item)}
                                        </div>
                                    )
                                })}

                            </div>

                        </div> }

                    </div>

                </div> }

            </div>
        )
    }
}

/* 
 * Quill modules to attach to editor
 * See https://quilljs.com/docs/modules/ for complete options
 */
Editor.modules = {
  toolbar: [
    [ 'bold', 
        'italic', 
        'underline', 
        { 'size': [false, 'small', 'large', 'huge'] }, 
        { 'header': [1, 2, 3, 4, 5, 6, false] }, 
        { 'font': [] }, 'strike', 'blockquote', 'code-block', 
        { 'color': [] }, 
        { 'background': [] }, 
        { 'script': 'sub'}, 
        { 'script': 'super' }, 
        {'list': 'ordered'}, 
        {'list': 'bullet'}, 
        {'indent': '-1'}, 
        {'indent': '+1'}, 
        { 'align': [] }, 
        'link', 
        'image'
    ],
    ['clean']
  ],
  clipboard: {
    // toggle to add extra line breaks when pasting HTML:
    matchVisual: false,
  }
}
/* 
 * Quill editor formats
 * See https://quilljs.com/docs/formats/
 */
Editor.formats = [
  'header', 'font', 'size',
  'bold', 'italic', 'underline', 'strike', 'blockquote',
  'list', 'bullet', 'indent',
  'link', 'image', 'video',
  'color', 'background', 'script', 'align', 'code-block'
]

/* 
 * PropType validation
 */
Editor.propTypes = {
  placeholder: function() { return ""; },
}

/* 
 * Render component on page
 */
let E = ReactDOM.render(
  <Editor />, 
  document.querySelector('.app')
);