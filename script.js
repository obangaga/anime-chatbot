// Inisialisasi aplikasi PIXI
const app = new PIXI.Application({
  view: document.getElementById("live2dCanvas"),
  autoStart: true,
  backgroundAlpha: 0,
  resizeTo: window
});

// Memuat model Live2D dari file model3.json
PIXI.live2d.Live2DModel.from("assets/mymodel/model3.json").then(model => {
  app.stage.addChild(model);

  // Atur ukuran dan posisi model
  model.scale.set(0.3);
  model.x = window.innerWidth / 2;
  model.y = window.innerHeight / 2;

  // Efek interaktif mouse (opsional)
  app.ticker.add(() => {
    const mouseX = app.renderer.plugins.interaction.mouse.global.x;
    const mouseY = app.renderer.plugins.interaction.mouse.global.y;
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    const angleX = (mouseX - centerX) * 0.1;
    const angleY = (mouseY - centerY) * 0.1;

    const coreModel = model.internalModel?.coreModel;
    if (coreModel) {
      coreModel.setParameterValueById("ParamAngleX", angleX);
      coreModel.setParameterValueById("ParamAngleY", angleY);
    }
  });
});
