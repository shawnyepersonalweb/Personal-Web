const model = tf.sequential();

model.add(tf.layers.conv2d({
  inputShape: [28, 28, 1],
  kernelSize: 5,
  filters: 8,
  strides: 1,
  activation: 'relu',
  kernelInitializer: 'varianceScaling'
}));
model.add(tf.layers.maxPooling2d({poolSize: [2,2], strides: [2,2]}));

model.add(tf.layers.conv2d({
  inputShape: [28, 28, 1],
  kernelSize: 5,
  filters: 16,
  strides: 1,
  activation: 'relu',
  kernelInitializer: 'varianceScaling'
}));
model.add(tf.layers.maxPooling2d({poolSize: [2,2], strides: [2,2]}));

model.add(tf.layers.flatten());
model.add(tf.layers.dense({units: 10, kernelInitializer: 'varianceScaling', activation: 'softmax'}));

const lr = 0.5;
const optimizer = tf.train.sgd(lr);

model.compile({
  optimizer: optimizer,
  loss: 'categoricalCrossentropy',
  metrics: ['accuracy']
})

const Bath_size = 64;
const Train_batches = 150;
const test_batch_size = 1000;
const test_iteration_frequency = 5;

async function train() {
  const lossValues = [];
  const accuracyValues = [];

  for (let i = 0; i < Train_batches; i++) {

  }
}
