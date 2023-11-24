void setup() {
  // Start the serial communication
  Serial.begin(9600);
}

void loop() {
  // Generate random values for left and right motor speeds
  int leftMotorSpeed = random(-100, 101);  // Random value between -100 and 100
  int rightMotorSpeed = random(-100, 101); // Random value between -100 and 100

  // Send the data in the format "L: [leftSpeed], R: [rightSpeed]"
  Serial.print("L: ");
  Serial.print(leftMotorSpeed);
  Serial.print(", R: ");
  Serial.println(rightMotorSpeed);

  // Wait for a second before sending the next set of values
  delay(1000);
}
