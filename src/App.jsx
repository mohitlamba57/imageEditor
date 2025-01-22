import { useRef, useState, useEffect } from 'react'
import * as fabric from 'fabric'
import './App.css'
import { FaRegSquare, FaRegCircle } from "react-icons/fa";
import { RiRectangleLine } from "react-icons/ri";



function App() {
  const apiKey = "Vef2WJyoe7RKiNKCUUwtqMcHdcMTnKVhUamNekmxkL8";
  const [search, setSearch] = useState(''); // State for the search query
  const [captions, setCaptions] = useState(''); // State for the caption
  const [url, setURL] = useState(null); // url for selected image
  const [apiResult, setApiResult] = useState([]); // State for API results
  const [loading, setLoading] = useState(false); // State for loading
  const [error, setError] = useState(null);// State for error handling
  let lastTextObject = null; // To keep track of the last added text object
  const canvasRef = useRef(null);
  const [canvas, setCanvas] = useState(null);
  const [showSearch, setshowSearch] = useState(true);

  const handleSearch = async () => {
    if (!search) {
      alert('Please enter a search term');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`https://api.unsplash.com/search/photos?page=1&query=${search}&client_id=${apiKey}`);
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      const data = await response.json();
      setApiResult(data.results || []); // Update results state
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    if (canvasRef.current) {
      // Dispose of any existing Fabric instance
      if (canvas) {
        canvas.dispose();
      }

      // Create a new Fabric instance
      const initCanvas = new fabric.Canvas(canvasRef.current, {
        width: 500,
        height: 500,
      });
      initCanvas.backgroundColor = "#fff";
      initCanvas.renderAll();
      setCanvas(initCanvas);
      if(url){
        addImageToCanvas(url);
      }

      return () => {
        initCanvas.dispose();
      }
    }
  }, [showSearch]);

  useEffect(() => {
    if (canvasRef.current) {
      addText();
    }
  }, [captions]);

  const addRectangle = () => {
    if (canvas) {
      const rect = new fabric.Rect({
        left: 150,
        top: 150,
        fill: 'black',
        width: 100,
        height: 70,
      });
      canvas.add(rect);
      canvas.renderAll();
    }
  }

  const addCircle = () => {
    if (canvas) {
      const circle = new fabric.Circle({
        left: 200,
        top: 200,
        radius: 50, // Radius of the circle
        fill: 'black',
      });
      canvas.add(circle);
      canvas.renderAll();
    }
  };

  const addSquare = () => {
    if (canvas) {
      const square = new fabric.Rect({
        left: 250,
        top: 250,
        fill: 'black',
        width: 100, // Equal width and height for a square
        height: 100,
      });
      canvas.add(square);
      canvas.renderAll();
    }
  };

  // Add text to the canvas
  const addText = () => {
    if (!canvas) {
      console.error("Canvas is not initialized.");
      return;
    }
    // Remove the previously added text object, if it exists
    if (lastTextObject) {
      canvas.remove(lastTextObject);
    }
    const text = new fabric.FabricText(captions || '', {
      left: 200,
      top: 200,
      fontSize: 24,
      fill: 'blue',
    });
    canvas.add(text);
    canvas.renderAll();
    lastTextObject = text;
  };

  const addImageToCanvas = async (imageUrl) => {
    // addText();
    if (canvas) {
      fabric.FabricImage.fromURL(imageUrl, (img) => {
        img.set({
          left: 100,
          top: 100,
          scaleX: 1.0,
          scaleY: 1.0,
        });
        canvas.add(img);
        canvas.renderAll();
        canvas.setActiveObject(img);
      });
    }
  };

  const timeOutFunction = (imagrurl) => {
    setURL(imagrurl);
    setshowSearch(false);
    console.log(imagrurl);
  }

  const download = () => {
    const imageSrc = canvas.toDataURL();
    const a = document.createElement('a');
    a.href = imageSrc;
    a.download = 'Image.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  return (
    <>
      {showSearch ? <div className='p-5'>
        <div className='float-left'>
          <p>Name: Mohit Lamba</p>
          <p>Email: mohitlamba5757@gmail.com</p>
        </div>
        <h2 className='text-5xl mb-6 mt-32'>Search image from the Web</h2>
        {/* Input field */}
        <input
          type="text"
          placeholder="Enter image term..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className='p-2 border-[1px] border-black	border-solid rounded-md w-[300px]'
        />
        {/* Search button */}
        <button
          onClick={handleSearch}
          className='py-2 px-5 ml-2 bg-cyan-500 text-white border-none rounded-md cursor-pointer'
        >
          Search
        </button>

        {/* Loading indicator */}
        {loading && <p>Loading...</p>}

        {/* Error message */}
        {error && <p style={{ color: 'red' }}>{error}</p>}

        {/* Display results */}
        <div className='flex w-full bg-slate-100 flex-wrap gap-[4%] mx-[4%]'>
          {apiResult.map((result, index) => (
            <div key={index} className='w-[20%] max-h-52 my-4 overflow-hidden'>
              <img src={result.urls.full} className='h-auto overflow-hidden' alt="" />
              <button
                onClick={() => timeOutFunction(result.urls.full)}
                className='py-2 px-5 mt-4 bg-cyan-500 text-white border-none rounded-md cursor-pointer z-50'
              >
                Caption
              </button>
            </div>
          ))}
        </div>
      </div> : (<div className='bg-slate-500 flex gap-10'> <canvas className='h-[500px] w-[500px] ml-5 py-5' id="canvas" ref={canvasRef}></canvas>
        <div className='my-5'>
          <div className='flex flex-row'>
            <FaRegSquare onClick={addSquare} className='text-7xl' />
            <FaRegCircle onClick={addCircle} className='text-7xl' />
            <RiRectangleLine onClick={addRectangle} className='text-7xl' />
          </div>
          <input
            type="text"
            placeholder="Caption Text"
            value={captions}
            onChange={(e) => setCaptions(e.target.value)}
            className='p-2 border-[1px] border-black	border-solid rounded-md w-full my-5'
          />
          <button
            onClick={() => download()}
            className='py-2 px-5 bg-cyan-500 text-white border-none rounded-md cursor-pointer z-50 w-full mt-5'
          >
            Download
          </button></div>
      </div>
      )}

    </>
  )
}

export default App
