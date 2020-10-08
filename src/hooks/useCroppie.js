import Croppie from 'croppie';
import 'croppie/croppie.css';
import React, { useState, useRef, useCallback, useEffect } from 'react';

function useCroppie(handleFireBaseUpload, displayForm) {

  const croppieDom = useRef();
  const croppie = useRef();
  const [state, setState] = useState({imageAsUrl: ""});


  useEffect(() => {


    if(typeof croppieDom.current !== "undefined" && croppieDom.current !== null) {

      croppie.current = new Croppie(croppieDom.current, {
        viewport: {
          width: 200, 
          height: 200, 
          type: 'circle'
        }
      });

      if(state.imageAsUrl !== "") {
        croppie.current.bind({
          url: state.imageAsUrl
        });
      }

    }
    

  })

  const cancelCroppie = useCallback((e) => {

    displayForm(false);
    setState({imageAsUrl: ""});

  }, [displayForm]);

  const saveImg = useCallback((e) => {

    croppie.current.result({ type: 'blob', format: 'png' }).then((optimizedImgAsFile) => {

      handleFireBaseUpload(optimizedImgAsFile);
      displayForm(false);
      setState({imageAsUrl: ""});

    })
    
    
  }, [handleFireBaseUpload, displayForm]);


  const loadCroppie = useCallback((e) => {

    // get the image as file

    var imageAsFile = e.target.files[0];

    // abort if the file is undefined
    if(imageAsFile === undefined) {
      return;
    }

    // read the image and bind it with the croppie
    var reader  = new FileReader();

    reader.addEventListener("load", function () {

      displayForm(true);
      setState({imageAsUrl: reader.result});

    }, false);

    reader.readAsDataURL(imageAsFile);
    
  }, [displayForm]);


  const CroppieDomContainer = function() {
    return (
      <div className="form-container-xs">
        <div className="form">
          <form>
            <div className="croppie-container">
              <div id="croppie" ref={croppieDom}>
              </div>
            </div>
            <div className="buttons-container">
              <button type="button" onClick={saveImg} className="btn-animated primary">Valider</button>
              <button type="button" onClick={cancelCroppie} className="btn-animated secondary">Annuler</button>
            </div>
          </form>
        </div>
      </div>
    )
  }
  

  return {loadCroppie, CroppieDomContainer};
}




export default useCroppie;