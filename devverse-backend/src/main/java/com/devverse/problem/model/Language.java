package com.devverse.problem.model;

public enum Language {
    CPP(54),
    JAVA(62),
    PYTHON(71),
    JAVASCRIPT(63),
    C(50);

    private final int judge0Id;

    Language(int judge0Id) {
        this.judge0Id = judge0Id;
    }

    public int getJudge0Id() {
        return judge0Id;
    }
}
