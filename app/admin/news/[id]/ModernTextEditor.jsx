import React, { useState, useEffect } from 'react';
import { Editor, EditorState, RichUtils, getDefaultKeyBinding, Modifier, convertToRaw, ContentState } from 'draft-js';
import 'draft-js/dist/Draft.css';
import { Button } from '@nextui-org/react';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';

const ModernTextEditor = ({ value, resultVal, onChange }) => {
     const [editorState, setEditorState] = useState(EditorState.createEmpty());

     useEffect(() => {
          if (value) {
               const contentBlock = htmlToDraft(value);
               if (contentBlock) {
                    const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
                    setEditorState(EditorState.createWithContent(contentState));
               }
          }
     }, [value]);

     const handleEditorChange = (state) => {
          setEditorState(state);
          const contentHtml = draftToHtml(convertToRaw(state.getCurrentContent()));
          onChange(contentHtml);
     };

     const handleKeyCommand = (command, editorState) => {
          const newState = RichUtils.handleKeyCommand(editorState, command);
          if (newState) {
               handleEditorChange(newState);
               return 'handled';
          }
          return 'not-handled';
     };

     const mapKeyToEditorCommand = (e) => {
          if (e.keyCode === 9) {
               const newEditorState = RichUtils.onTab(e, editorState, 4);
               if (newEditorState !== editorState) {
                    handleEditorChange(newEditorState);
               }
               return;
          }
          return getDefaultKeyBinding(e);
     };

     const toggleBlockType = (blockType) => {
          handleEditorChange(RichUtils.toggleBlockType(editorState, blockType));
     };

     const toggleInlineStyle = (inlineStyle) => {
          handleEditorChange(RichUtils.toggleInlineStyle(editorState, inlineStyle));
     };

     const styleMap = {
          'MONOSPACE': {
               fontFamily: 'monospace',
          },
     };

     const blockStyleFn = (contentBlock) => {
          const type = contentBlock.getType();
          if (type === 'blockquote') {
               return 'block-quote';
          }
          if (type.startsWith('header-')) {
               return `header-${type.split('-')[1]}`;
          }
     };

     return (
          <div className="w-full bg-white rounded-lg">
               {value}
               <hr />
               {resultVal}
               <div className="mb-4 flex flex-wrap gap-2">
                    {['H1', 'H2', 'H3', 'H4', 'H5', 'H6'].map((header) => (
                         <Button
                              key={header}
                              size="sm"
                              auto
                              onClick={(e) => {
                                   e.preventDefault();
                                   toggleBlockType(`header-${header[1]}`);
                              }}
                              className="text-sm"
                         >
                              {header}
                         </Button>
                    ))}
                    <Button size="sm" auto onClick={(e) => { e.preventDefault(); toggleBlockType('blockquote'); }} className="text-sm">
                         Quote
                    </Button>
                    <Button size="sm" auto onClick={(e) => { e.preventDefault(); toggleBlockType('unordered-list-item'); }} className="text-sm">
                         UL
                    </Button>
                    <Button size="sm" auto onClick={(e) => { e.preventDefault(); toggleBlockType('ordered-list-item'); }} className="text-sm">
                         OL
                    </Button>
                    <Button size="sm" auto onClick={(e) => { e.preventDefault(); toggleBlockType('code-block'); }} className="text-sm">
                         Code Block
                    </Button>
                    <Button size="sm" auto onClick={(e) => { e.preventDefault(); toggleInlineStyle('BOLD'); }} className="text-sm">
                         B
                    </Button>
                    <Button size="sm" auto onClick={(e) => { e.preventDefault(); toggleInlineStyle('ITALIC'); }} className="text-sm">
                         I
                    </Button>
                    <Button size="sm" auto onClick={(e) => { e.preventDefault(); toggleInlineStyle('UNDERLINE'); }} className="text-sm">
                         U
                    </Button>
                    <Button size="sm" auto onClick={(e) => { e.preventDefault(); toggleInlineStyle('MONOSPACE'); }} className="text-sm">
                         Mono
                    </Button>
               </div>
               <div className="border rounded-lg p-4 min-h-[300px] focus-within:ring-2 focus-within:ring-blue-500">
                    <Editor
                         editorState={editorState}
                         handleKeyCommand={handleKeyCommand}
                         keyBindingFn={mapKeyToEditorCommand}
                         onChange={handleEditorChange}
                         placeholder="Start typing..."
                         customStyleMap={styleMap}
                         blockStyleFn={blockStyleFn}
                    />
               </div>
               <style jsx global>{`
        .header-1 { font-size: 2em; font-weight: bold; }
        .header-2 { font-size: 1.5em; font-weight: bold; }
        .header-3 { font-size: 1.17em; font-weight: bold; }
        .header-4 { font-size: 1em; font-weight: bold; }
        .header-5 { font-size: 0.83em; font-weight: bold; }
        .header-6 { font-size: 0.67em; font-weight: bold; }
        .block-quote { 
          border-left: 5px solid #ccc;
          margin: 1.5em 10px;
          padding: 0.5em 10px;
          quotes: "\\201C""\\201D""\\2018""\\2019";
        }
        .block-quote:before {
          color: #ccc;
          content: open-quote;
          font-size: 4em;
          line-height: 0.1em;
          margin-right: 0.25em;
          vertical-align: -0.4em;
        }
      `}</style>
          </div>
     );
};

export default ModernTextEditor;