class ElectroMachine {
    allLogRecords = "";

    PI = Math.PI; //константа, число Pi
  
    R1 = 1.432; //обмотка статора (0.5 - 5)
    RP2 = 2.21; //обмотка ротора (1 - 5)
    AXG1 = 3.17; //сопротивление рассеивания (1 - 10)
  
    DZ = 0.969; //приведенный коэффициент (0,5 - 2,5)
    AKI = 0.739; //коэффициент приведения по току (0,5 - 1)
  
    DA = 0.20; //диаметр машины (метров) (0,1 - 0,5)
    ALA = 0.11; //длина машины (метров) (0,05 - 1)
  
    W1 = 264; //витков статора (100 - 500)
  
    U1 = 220; //напряжение (вольт)
    XPC = 14.33; //емкостное сопротивление обмотки ротора (в единицах)
    AGO = 0.000654; //проводимость воздушного зазора (0,0003 - 0,001)
  
    AP1 = 5; //полюстность обмотки (1 - 10)
    AP2 = 3; //полюстность обмотки2 (1 - 10)
  
    M1 = 3; //число фаз
    AK01 = 0.93; //обмоточный коэффициент (0,5 - 1)
    AKP = 17; //коэффициент редукции (10 - 30)
  
    AKMS = 1; //начальный коэффициент насыщения
    AKMP = 1; //начальный коэффициент насыщения
  
    S = 0.706;
    H = 0.31;
    AK1 = 0.0;
    ALFN = 1.1 * this.PI;
    OMG = 314; //константа - зависит от частоты тока
  
    printLog(s) {
      this.allLogRecords = this.allLogRecords + s + "\n";
    }

    fmt1(v) {
      return v.toFixed(4);
    }  

    fmt2(v) {
      return v.toFixed(6);
    }  

  
    YhFunction(fp, fs, ap1, ap2, x) {
        return fp * Math.cos(ap1 * x) + fs * Math.cos(ap2 * x);
    }    

    //функция насыщения стали методом кусочно-линейной аппроксимации (с нелинейными участками)
    Bz2Function(h) {
        var rval = 0;
        var h1 = Math.abs(h);
    
        if (h1 > 0 && h1 < 785) {
          rval = 0.000637 * h1;
        } else if (h1 > 785 && h1 < 1350) {
          rval = 0.4835 + Math.sqrt(0.2337 - 0.292 + h1 / 13338);
        } else if (h1 > 1350) {
          rval = 0.582 + h1 / 12500;
        }
    
        if (h < 0) rval = (-1) * rval;
        return rval;
    }

    amRoutine() {
        var X1 = (this.M1 * Math.pow(this.W1 * this.AK01 / this.AP1, 2) * this.DA * this.ALA * this.AGO * this.OMG) / this.PI;
        var A = 2 * this.M1 / (this.PI * this.DA * this.ALA * this.AGO * this.OMG);
        var D1 = Math.sqrt(A * X1);
        var AD2 = this.DZ * D1;
    
        var DELS = 0, DELP = 0;
        var ALF1, ALF2, G1, G2, AKG1, AKG2, C1, C2;
        var hp2, A1, A2, A3;
        var B11, B12, B3, B4, B5;
        var AKO, AI1A, AI1R, AI2PA, AI2PR, AI0A, AI0R;
        var AI1, AI2P, AI2, AI0, AH, A4;
        var FP, FS;
        var DLA, D2;
        var HH, H4;
        var SHS, SHP, S43, S45;
        var HN, HQ;
        var B1, BK1, BK2, BMP, BMS;
        var AKMP1, AKMS1;
    
        do {
          ALF1 = this.AKMP * this.R1 / X1;
          ALF2 = this.AKMP * this.RP2 / (X1 * this.S);
          G1 = this.AKMP * this.AXG1 / X1;
          G2 = this.AKMP * (Math.pow(this.DZ, 2) / this.AKMS + this.AK1 - this.XPC / (Math.pow(this.S, 2) * X1));
          AKG1 = 1. + G1;
          AKG2 = 1. + G2;
          C1 = ALF1 * ALF2 - AKG1 * AKG2 + 1.;
          C2 = ALF1 * AKG2 + ALF2 * AKG1;
    
          hp2 = Math.pow(this.H, 2);
    
          A1 = hp2 * (4. * ALF1 + ALF2);
          A2 = hp2 * (4. * G1 + AKG2);
          A3 = 2. * this.H * (hp2 - G2);
          B11 = 2. * hp2 * ALF1;
          B12 = 2. * hp2 * G1;
          B3 = this.H * (ALF1 + ALF2 + ALF2 * G1 - ALF1 * G2);
          B4 = this.H * (G1 * G2 + ALF1 * ALF2 + G2 - G1 - hp2);
          B5 = hp2 * (4 * (Math.pow(ALF1, 2) + Math.pow(G1, 2)) + 2 * (ALF1 * ALF2 + G1 * G2) + 2 * (G1 + G2) - hp2);
    
          AKO = this.AKMP * this.U1 / (X1 * (Math.pow(C1, 2) + Math.pow(C2, 2) - B5));
          AI1A = AKO * (ALF2 * C1 + AKG2 * C2 - A1 + A3 * Math.sin(this.ALFN));
          AI1R = AKO * (AKG2 * C1 - ALF2 * C2 + A2 - A3 * Math.cos(this.ALFN));
    
          AI2PA = AKO * (-C2 + B11 + B3 * Math.cos(this.ALFN) + B4 * Math.sin(this.ALFN));
          AI2PR = AKO * (-C1 - B12 - hp2 - B4 * Math.cos(this.ALFN) + B3 * Math.sin(this.ALFN));
    
          AI0A = AI1A + AI2PA;
          AI0R = AI1R + AI2PR;
    
          AI1 = Math.sqrt(Math.pow(AI1A, 2) + Math.pow(AI1R, 2));
          AI2P = Math.sqrt(Math.pow(AI2PA, 2) + Math.pow(AI2PR, 2));
    
          AI2 = this.AKI * AI2P;
          AI0 = Math.sqrt(Math.pow(AI0A, 2) + Math.pow(AI0R, 2));
          FP = AI0 * D1;
          FS = AI2P * AD2;
    
          DLA = this.PI / 96;
          D2 = 2 * DLA;
          AH = DLA;
          A4 = 0;
    
          HH = this.YhFunction(FP, FS, this.AP1, this.AP2, AH);
          SHS = this.Bz2Function(HH) * Math.cos(this.AP2 * AH);
          SHP = this.Bz2Function(HH) * Math.cos(this.AP1 * AH);
    
          S43 = 0;
          S45 = 0;
    
          for (var i = 0; i < 47; i++) {
            AH = AH + D2;
            A4 = A4 + D2;
            HH = this.YhFunction(FP, FS, this.AP1, this.AP2, AH);
            H4 = this.YhFunction(FP, FS, this.AP1, this.AP2, A4);
            SHS = SHS + this.Bz2Function(HH) * Math.cos(this.AP2 * AH);
            SHP = SHP + this.Bz2Function(HH) * Math.cos(this.AP1 * AH);
            S43 = S43 + this.Bz2Function(HH) * Math.cos(this.AP2 * A4);
            S45 = S45 + this.Bz2Function(H4) * Math.cos(this.AP1 * A4);
            // console.log("i: " + i + " |SHS: " + this.fmt1(SHS) + " |SHP: " + this.fmt1(SHP) + " |HH: " + this.fmt1(HH) + " |H4: " + this.fmt1(H4) + " |S43: " + this.fmt1(S43) + " |S45: " + this.fmt1(S45) );
          }
    
          HN = this.YhFunction(FP, FS, this.AP1, this.AP2, 0);
          HQ = this.YhFunction(FP, FS, this.AP1, this.AP2, this.PI);
    
          B1 = this.Bz2Function(HN) * Math.cos(0);
          BK1 = this.Bz2Function(HQ) * Math.cos(this.AP2 * this.PI);
          BK2 = this.Bz2Function(HQ) * Math.cos(this.AP1 * this.PI);
    
          BMP = (B1 + BK2 + 2. * S45 + 4. * SHP) * 2. * DLA / (3. * this.PI);
          BMS = (B1 + BK1 + 2. * S43 + 4. * SHS) * 2. * DLA / (3. * this.PI);
    
          AKMP1 = FP * this.AGO / BMP;
          AKMS1 = FS * this.AGO / BMS;
          DELP = Math.abs(AKMP1 - this.AKMP);
          DELS = Math.abs(AKMS1 - this.AKMS);
          this.AKMP = this.AKMP + (AKMP1 - this.AKMP) / 2;
          this.AKMS = this.AKMS + (AKMS1 - this.AKMS) / 2;
    
          // console.log("B1: " + this.fmt1(B1) 
          // + " |BMS: " + this.fmt1(BMS) 
          // + " |BMP: " + this.fmt1(BMP) 
          // + " |AKMP1: " + this.fmt1(AKMP1) 
          // + " |AKMS1: " + this.fmt1(AKMS1)
          // + " |AKMP: " + this.fmt1(this.AKMP) 
          // + " |AKMS: " + this.fmt1(this.AKMS)
          // + " |DELP: " + this.fmt1(DELP) 
          // + " |DELS: " + this.fmt1(DELS)
          // );
        } while (DELS >= 0.02 || DELP >= 0.02);
    
    
        var FI0, FI1, FI2, TET;
        var Q1, Q2;
        var AMS, AMA;
        var TP1, TP2;
        var AKPD;
    
        FI1 = Math.atan2(AI1R, AI1A);
        FI2 = Math.atan2(AI2PR, AI2PA);
        FI0 = Math.atan2(AI0R, AI0A);
    
        TET = FI0 + FI2 - this.ALFN;
        Q1 = Math.cos(FI1);
        Q2 = Math.sin(TET);
        AMS = (2. * this.M1 * this.H * this.AKP * X1 * AI0 * AI2P * Q2) / (this.OMG * this.AKMP);
        AMA = this.M1 * this.AP1 * this.RP2 * Math.pow(AI2P, 2) / (this.OMG * this.S);
        TP2 = (AMS + AMA) * this.OMG / this.AKP;
        TP1 = this.M1 * this.U1 * AI1 * Q1;
        AKPD = TP2 / TP1;
    
        this.printLog("--------------------------------------------------------------------------------");
        this.printLog("AKPM1: " + this.fmt1(AKMP1) + "\tAKMS1: " + this.fmt1(AKMS1) + "\tBMP: " + this.fmt1(BMP) + "\tBMS: " + this.fmt1(BMS));
        this.printLog("AI1: " + this.fmt1(AI1) + "\tAI2: " + this.fmt1(AI2) + "\tQ1: " + this.fmt1(Q1) + "\tAKPD: " + this.fmt1(AKPD));
        this.printLog("AI0: " + this.fmt1(AI0) + "\tAI2P: " + this.fmt1(AI2P) + "\tAMS: " + this.fmt1(AMS) + "\tAMA: " + this.fmt1(AMA));
        this.printLog("FI1: " + this.fmt1(FI1) + "\tFI2: " + this.fmt1(FI2) + "\tFI0: " + this.fmt1(FI0));
      }

    
  //основная процедура расчета
    doCalculate() {
        this.allLogRecords = "";
        this.printLog("Входные параметры:");
        this.printLog("R1: " + this.fmt1(this.R1) + "\tRP2: " + this.fmt1(this.RP2) + "\tAXG1: " + this.fmt1(this.AXG1) + "\tDZ: " + this.fmt1(this.DZ));
        this.printLog("AKI: " + this.fmt1(this.AKI) + "\tDA: " + this.fmt1(this.DA) + "\tALA: " + this.fmt1(this.ALA) + "\tW1: " + this.fmt1(this.W1));
        this.printLog("U1: " + this.fmt1(this.U1) + "\tXPC: " + this.fmt1(this.XPC) + "\tAGO: " + this.fmt2(this.AGO) + "\n");
        
        for (var K = 0; K < 21; K++) {
          this.ALFN = this.ALFN - 0.05 * this.PI;
          this.amRoutine();
          this.printLog("S: " + this.fmt1(this.S) + "\tH: " + this.fmt1(this.H) + "\tALFN: " + this.fmt1(this.ALFN) + "\tAK1: " + this.fmt1(this.AK1) + "\n");
        }
    
        this.H = 0;
        this.AK1 = 0.17;
        this.ALFN = this.PI / 2;
        this.S = 0.656;
        this.AKMP = 1;
        this.AKMS = 1;
    
        for (var J = 0; J < 7; J++) {
          this.S = this.S + 0.05;
          if (this.S > 1) this.S = 1;
          this.amRoutine();
          this.printLog("S: " + this.fmt1(this.S) + "\tH: " + this.fmt1(this.H) + "\tALFN: " + this.fmt1(this.ALFN) + "\tAK1: " + this.fmt1(this.AK1));
        }
      }
       
    
}