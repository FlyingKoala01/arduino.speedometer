#include <Wire.h>
#include <EVShield.h>
#include <EVShieldAGS.h>
#include <EVs_NXTLight.h>
EVShield evshield(0x34, 0x36); // Inicialitza l'EVShield amb les adreces I2C especificades
EVs_NXTLight myLight; // Creem el nostre sensor per a ús en aquest programa
// Paràmetres del controlador PID
float kp = 0.7;  // Ganància proporcional
float ki = 0.005; // Ganància integral
float kd = 0.1;  // Ganància derivativa
// Inicialització de variables PID
int integral = 0;
int lastError = 0;
// Valor desitjat (punt de referència)
int referencia = 550; //menys llum = 590 //mes llum=550
int maxSpeed = 80;
//Inicialitzar variables per calcular el IAE
unsigned long int IAE = 0;
int temps_final = 0;
int temps_inicial = 0;
int increment_temps = 0;
void setup() {
  Serial.begin(9600); // Iniciem la comunicació sèrie per a la sortida
  delay(2000); // Esperem dos segons, permetent temps per activar el monitor sèrie
   // Inicialitzem el sensor de llum i especifiquem on està connectat
  evshield.init(SH_HardwareI2C);
  myLight.init(&evshield, SH_BAS1);
  myLight.setReflected();
   // Esperem fins que l'usuari premi el botó GO per continuar el programa
  while (!evshield.getButtonState(BTN_GO)) {
      if (millis() % 1000 < 3) {
          Serial.println("Press GO button to continue");
      }
  }
   // Reiniciem els motors
  evshield.bank_a.motorReset();
  evshield.bank_b.motorReset();
}
void loop() {
  // Llegim el valor del sensor de llum
  int light = myLight.readRaw();
   // Càlcul de l'error
  int error = light - referencia;
   // Terme proporcional
  int proporcionalTerm = (int)(kp * error);
   // Terme integral
  integral += error;
  int integralTerm = (int)(ki * integral);
  if(integralTerm>100){
   integralTerm=100;
  } else if(integralTerm<-100){
   integralTerm=-100;
  }
   // Terme derivatiu
  int derivativeTerm = (int)(kd * (error - lastError));
  lastError = error;    
   // Càlcul de la velocitat de cada motor
  int leftMotorSpeed = maxSpeed - (proporcionalTerm + integralTerm + derivativeTerm);
  int rightMotorSpeed = maxSpeed + (proporcionalTerm + integralTerm + derivativeTerm);
   // Limitem els valors de velocitat entre -100 i 100
  leftMotorSpeed = constrain(leftMotorSpeed, -100, 100);
  rightMotorSpeed = constrain(rightMotorSpeed, -100, 100);
  Serial.print("L: ");
  Serial.print(leftMotorSpeed);
  Serial.print(", R: ");
  Serial.println(rightMotorSpeed);
   // Apliquem la velocitat als motors
  evshield.bank_a.motorSetSpeed(SH_Motor_1, leftMotorSpeed);
  evshield.bank_a.motorSetSpeed(SH_Motor_2, rightMotorSpeed);
   // Movem els motors cap endavant durant 90 graus amb la velocitat específica de cadascun
  evshield.bank_a.motorRunDegrees(SH_Motor_1, SH_Direction_Reverse, leftMotorSpeed, 90, SH_Completion_Dont_Wait, SH_Next_Action_Float);
  evshield.bank_a.motorRunDegrees(SH_Motor_2, SH_Direction_Reverse, rightMotorSpeed, 90, SH_Completion_Wait_For, SH_Next_Action_Float);
   //Càlcul IAE
  temps_final=millis();
  increment_temps=(temps_final-temps_inicial);
  temps_inicial=temps_final;
  IAE=IAE+increment_temps*abs(error);
  //Serial.print("IAE: ");
  //Serial.println(IAE);
}