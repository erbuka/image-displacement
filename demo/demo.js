(function () {



    const loadImageToCanvas = function (imageId) {

        let image = document.getElementById(imageId);
        let canvas = document.createElement("canvas");
        let ctx = canvas.getContext("2d");

        canvas.width = image.naturalWidth;
        canvas.height = image.naturalHeight;

        ctx.drawImage(image, 0, 0);

        return canvas;

    }




    const updateUI = function () {
        document.getElementById("strength-display").innerHTML = document.getElementById("strength").value;
    }

    window.addEventListener("load", function () {

        document.getElementById("run").addEventListener("click", async () => {


            let prevCanvas = document.getElementById("result");
            if (prevCanvas)
                prevCanvas.remove();

            let result = document.createElement("div");
            result.setAttribute("id", "result");

            let strength = parseInt(document.getElementById("strength").value);

            // Displace
            {

                let srcCanvas = loadImageToCanvas("src");
                let mapCanvas = loadImageToCanvas("map");
                let resultCanvas = displacement(srcCanvas, mapCanvas, strength);
                result.appendChild(resultCanvas);
            }

            // Generate normals
            {
                let heightMapCanvas = loadImageToCanvas("map");
                result.appendChild(generateNormal(heightMapCanvas, strength))
            }

            document.body.appendChild(result);


        });

        document.getElementById("strength").addEventListener("input", updateUI);

        updateUI();

    });

})();