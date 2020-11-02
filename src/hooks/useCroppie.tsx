import React, { useState, useRef, useCallback, useEffect } from 'react';
import Croppie from 'croppie';
import 'croppie/croppie.css';

function useCroppie(
  handleFireBaseUpload: (file: Blob) => void,
  displayForm: (shouldDisplay: boolean) => void,
) {
  const croppieDom = useRef<HTMLDivElement | null>(null);
  const croppie = useRef<Croppie>();
  const [imageAsUrl, setImageAsUrl] = useState("");

  useEffect(() => {
    if (typeof croppieDom.current != "undefined" && croppieDom.current !== null) {
      croppie.current = new Croppie(croppieDom.current, {
        viewport: {
          width: 200,
          height: 200,
          type: "circle",
        },
      });

      if (imageAsUrl !== "") {
        croppie.current.bind({
          url: imageAsUrl,
        });
      }
    }
  }, [imageAsUrl]);

  const cancelCroppie = useCallback((e) => {
    displayForm(false);
    setImageAsUrl('');
  }, [displayForm]);

  const saveImg = useCallback((e) => {
    croppie.current
    ?.result({ type: 'blob', format: 'png' })
    .then((optimizedImgAsFile) => {
      handleFireBaseUpload(optimizedImgAsFile);
      displayForm(false);
      setImageAsUrl('');
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
    var reader = new FileReader();

    reader.addEventListener("load", () => {
      if (reader) {
        const url = reader.result?.toString();
        displayForm(true);
        url && setImageAsUrl(url);
      }
    }, false);

    reader.readAsDataURL(imageAsFile);
  }, [displayForm]);

  const CroppieDomContainer = useCallback(
    () => (
      <div className="form-container-xs">
        <div className="form">
          <form>
            <div className="croppie-container">
              <div id="croppie" ref={croppieDom}></div>
            </div>
            <div className="buttons-container">
              <button
                type="button"
                onClick={saveImg}
                className="btn-animated primary"
              >
                Valider
              </button>
              <button
                type="button"
                onClick={cancelCroppie}
                className="btn-animated secondary"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      </div>
    ),
    [saveImg, cancelCroppie]
  );

  return {loadCroppie, CroppieDomContainer};
}

export default useCroppie;
