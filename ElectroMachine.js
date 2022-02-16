class ElectroMachine {
    out_log = "";

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
    ALFN = 1.1 * PI;
    OMG = 314; //константа - зависит от частоты тока
  
    f_format = "%.4f";
    f_format2 = "%.6f";

    printLog(s) {
        out_log = out_log + s + "\n";
    }
    
  
    YhFunction(fp, fs, ap1, ap2, x) {
        return fp * Math.cos(ap1 * x) + fs * Math.cos(ap2 * x);
    }    

    Bz2Function(h) {
        rval = 0;
        h1 = Math.abs(h);
    
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
        i;
        X1;
    
        X1 = (M1 * Math.pow(W1 * AK01 / AP1, 2) * DA * ALA * AGO * OMG) / PI;
    
        A = 2 * M1 / (PI * DA * ALA * AGO * OMG);
        D1 = Math.sqrt(A * X1);
        AD2 = DZ * D1;
    
        DELS = 0, DELP = 0;
        ALF1, ALF2, G1, G2, AKG1, AKG2, C1, C2;
        hp2, A1, A2, A3;
        B11, B12, B3, B4, B5;
        AKO, AI1A, AI1R, AI2PA, AI2PR, AI0A, AI0R;
        AI1, AI2P, AI2, AI0, AH, A4;
        FP, FS;
        DLA, D2;
        HH, H4;
        SHS, SHP, S43, S45;
        HN, HQ;
        B1, BK1, BK2, BMP, BMS;
        AKMP1, AKMS1;
    
        do {
          ALF1 = AKMP * R1 / X1;
          ALF2 = AKMP * RP2 / (X1 * S);
          G1 = AKMP * AXG1 / X1;
          G2 = AKMP * (Math.pow(DZ, 2) / AKMS + AK1 - XPC / (Math.pow(S, 2) * X1));
          AKG1 = 1. + G1;
          AKG2 = 1. + G2;
          C1 = ALF1 * ALF2 - AKG1 * AKG2 + 1.;
          C2 = ALF1 * AKG2 + ALF2 * AKG1;
    
          hp2 = Math.pow(H, 2);
    
          A1 = hp2 * (4. * ALF1 + ALF2);
          A2 = hp2 * (4. * G1 + AKG2);
          A3 = 2. * H * (hp2 - G2);
          B11 = 2. * hp2 * ALF1;
          B12 = 2. * hp2 * G1;
          B3 = H * (ALF1 + ALF2 + ALF2 * G1 - ALF1 * G2);
          B4 = H * (G1 * G2 + ALF1 * ALF2 + G2 - G1 - hp2);
          B5 = hp2 * (4 * (Math.pow(ALF1, 2) + Math.pow(G1, 2)) + 2 * (ALF1 * ALF2 + G1 * G2) + 2 * (G1 + G2) - hp2);
    
          AKO = AKMP * U1 / (X1 * (Math.pow(C1, 2) + Math.pow(C2, 2) - B5));
          AI1A = AKO * (ALF2 * C1 + AKG2 * C2 - A1 + A3 * Math.sin(ALFN));
          AI1R = AKO * (AKG2 * C1 - ALF2 * C2 + A2 - A3 * Math.cos(ALFN));
    
          AI2PA = AKO * (-C2 + B11 + B3 * Math.cos(ALFN) + B4 * Math.sin(ALFN));
          AI2PR = AKO * (-C1 - B12 - hp2 - B4 * Math.cos(ALFN) + B3 * Math.sin(ALFN));
    
          AI0A = AI1A + AI2PA;
          AI0R = AI1R + AI2PR;
    
          AI1 = Math.sqrt(Math.pow(AI1A, 2) + Math.pow(AI1R, 2));
          AI2P = Math.sqrt(Math.pow(AI2PA, 2) + Math.pow(AI2PR, 2));
    
          AI2 = AKI * AI2P;
          AI0 = Math.sqrt(Math.pow(AI0A, 2) + Math.pow(AI0R, 2));
          FP = AI0 * D1;
          FS = AI2P * AD2;
    
          DLA = PI / 96;
          D2 = 2 * DLA;
    
          AH = DLA;
          A4 = 0;
    
          HH = YhFunction(FP, FS, AP1, AP2, AH);
          H4 = YhFunction(FP, FS, AP1, AP2, A4);
    
          SHS = Bz2Function(HH) * Math.cos(AP2 * AH);
          SHP = Bz2Function(HH) * Math.cos(AP1 * AH);
    
          S43 = 0;
          S45 = 0;
    
          for (i = 0; i < 47; i++) {
            AH = AH + D2;
            A4 = A4 + D2;
            HH = YhFunction(FP, FS, AP1, AP2, AH);
            H4 = YhFunction(FP, FS, AP1, AP2, A4);
            SHS = SHS + Bz2Function(HH) * Math.cos(AP2 * AH);
            SHP = SHP + Bz2Function(HH) * Math.cos(AP1 * AH);
            S43 = S43 + Bz2Function(HH) * Math.cos(AP2 * A4);
            S45 = S45 + Bz2Function(H4) * Math.cos(AP1 * A4);
          }
    
          HN = YhFunction(FP, FS, AP1, AP2, 0);
          HQ = YhFunction(FP, FS, AP1, AP2, PI);
    
          B1 = Bz2Function(HN) * Math.cos(0);
          BK1 = Bz2Function(HQ) * Math.cos(AP2 * PI);
          BK2 = Bz2Function(HQ) * Math.cos(AP1 * PI);
    
          BMP = (B1 + BK2 + 2. * S45 + 4. * SHP) * 2. * DLA / (3. * PI);
          BMS = (B1 + BK1 + 2. * S43 + 4. * SHS) * 2. * DLA / (3. * PI);
    
          AKMP1 = FP * AGO / BMP;
          AKMS1 = FS * AGO / BMS;
          DELP = AKMP1 - AKMP;
          DELS = AKMS1 - AKMS;
          AKMP = AKMP + (AKMP1 - AKMP) / 2;
          AKMS = AKMS + (AKMS1 - AKMS) / 2;
          DELP = Math.abs(DELP);
          DELS = Math.abs(DELS);
    
          //printLog("i: " + i + " |B1: " + String.format(f_format, B1) + " |BMS: " + String.format(f_format, BMS) + " |AKMS1: " + String.format(f_format, AKMS1));
        } while (DELS >= 0.02 || DELP >= 0.02);
    
    
        FI0, FI1, FI2, TET;
        Q1, Q2;
        AMS, AMA;
        TP1, TP2;
        AKPD;
    
        FI1 = Math.atan2(AI1R, AI1A);
        FI2 = Math.atan2(AI2PR, AI2PA);
        FI0 = Math.atan2(AI0R, AI0A);
    
        TET = FI0 + FI2 - ALFN;
        Q1 = Math.cos(FI1);
        Q2 = Math.sin(TET);
        AMS = (2. * M1 * H * AKP * X1 * AI0 * AI2P * Q2) / (OMG * AKMP);
        AMA = M1 * AP1 * RP2 * Math.pow(AI2P, 2) / (OMG * S);
        TP2 = (AMS + AMA) * OMG / AKP;
        TP1 = M1 * U1 * AI1 * Q1;
        AKPD = TP2 / TP1;
    
        printLog("--------------------------------------------------------------------------------");
        printLog("AKPM1: " + String.format(f_format, AKMP1) + "\tAKMS1: " + String.format(f_format, AKMS1) + "\tBMP: " + String.format(f_format, BMP) + "\tBMS: " + String.format(f_format, BMS));
        printLog("AI1: " + String.format(f_format, AI1) + "\tAI2: " + String.format(f_format, AI2) + "\tQ1: " + String.format(f_format, Q1) + "\tAKPD: " + String.format(f_format, AKPD));
        printLog("AI0: " + String.format(f_format, AI0) + "\tAI2P: " + String.format(f_format, AI2P) + "\tAMS: " + String.format(f_format, AMS) + "\tAMA: " + String.format(f_format, AMA));
        printLog("FI1: " + String.format(f_format, FI1) + "\tFI2: " + String.format(f_format, FI2) + "\tFI0: " + String.format(f_format, FI0));
        //printLog("m1: " + M1 + " |H: " + H + " |AKP: " + AKP + " |OMG: " + OMG + " |AKMP: " + AKMP);
    
      }
    
  //основная процедура расчета
    doCalculate() {
        K = 0, J = 0;
    
        out_log = "";
        printLog("input parameters:");
        printLog("R1: " + String.format(f_format, R1) + "\tRP2: " + String.format(f_format, RP2) + "\tAXG1: " + String.format(f_format, AXG1) + "\tDZ: " + String.format(f_format, DZ));
        printLog("AKI: " + String.format(f_format, AKI) + "\tDA: " + String.format(f_format, DA) + "\tALA: " + String.format(f_format, ALA) + "\tW1: " + String.format(f_format, W1));
        printLog("U1: " + String.format(f_format, U1) + "\tXPC: " + String.format(f_format, XPC) + "\tAGO: " + String.format(f_format2, AGO) + "\n");
        
        for (K = 0; K < 21; K++) {
          //printLog("K: " + K + "\n");
          ALFN = ALFN - 0.05 * PI;
          amRoutine();
          printLog("S: " + String.format(f_format, S) + "\tH: " + String.format(f_format, H) + "\tALFN: " + String.format(f_format, ALFN) + "\tAK1: " + String.format(f_format, AK1) + "\n");
        }
    
        H = 0;
        AK1 = 0.17;
        ALFN = PI / 2;
        S = 0.656;
        AKMP = 1;
        AKMS = 1;
    
        //printLog("\n");
        //printLog("start J --------------------------------------------");
        for (J = 0; J < 7; J++) {
          S = S + 0.05;
          if (S > 1) S = 1;
          amRoutine();
          printLog("S: " + String.format(f_format, S) + "\tH: " + String.format(f_format, H) + "\tALFN: " + String.format(f_format, ALFN) + "\tAK1: " + String.format(f_format, AK1));
        }
      }
       
    
}