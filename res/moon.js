class Moon {

    // SVG Icons
    newMoon        = '<svg viewBox="0 0 24 24"><path d="M12 20A8 8 0 1 1 20 12A8 8 0 0 1 12 20M12 2A10 10 0 1 0 22 12A10 10 0 0 0 12 2Z" /></svg>';
    waxingCrescent = '<svg viewBox="0 0 24 24"><path d="M12 2A9.91 9.91 0 0 0 9 2.46A10 10 0 0 1 9 21.54A10 10 0 1 0 12 2Z" /></svg>';
    firstQuarter   = '<svg viewBox="0 0 24 24"><path d="M12 2V22A10 10 0 0 0 12 2Z" /></svg>';
    waxingGibbous  = '<svg viewBox="0 0 24 24"><path d="M6 12C6 7.5 7.93 3.26 12 2A10 10 0 0 1 12 22C7.93 20.74 6 16.5 6 12Z" /></svg>';
    fullMoon       = '<svg viewBox="0 0 24 24"><path d="M12 2A10 10 0 1 1 2 12A10 10 0 0 1 12 2Z" /></svg>';
    waningGibbous  = '<svg viewBox="0 0 24 24"><path d="M18 12C18 7.5 16.08 3.26 12 2A10 10 0 0 0 12 22C16.08 20.74 18 16.5 18 12Z" /></svg>';
    thirdQuarter   = '<svg viewBox="0 0 24 24"><path d="M12 2A10 10 0 0 0 12 22Z" /></svg>';
    waningCrescent = '<svg viewBox="0 0 24 24"><path d="M2 12A10 10 0 0 0 15 21.54A10 10 0 0 1 15 2.46A10 10 0 0 0 2 12Z" /></svg>';

    // Moon Phases
    phases = [
        'New Moon',
        'Waxing Crescent',
        'First Quarter',
        'Waxing Gibbous',
        'Full Moon',
        'Waning Gibbous',
        'Third Quarter',
        'Waning Crescent'
    ];

    phase(phase) {
        phase = parseFloat(phase)
        let svg;
        let txt;
        switch (true) {
            case ((phase > 0) && (phase < 0.25)):
                svg = this.waxingCrescent;
                txt = this.phases[1];
                break;
            case (phase === 0.25):
                svg = this.firstQuarter;
                txt = this.phases[2];
                break;
            case ((phase > 0.25) && (phase < 0.5)):
                svg = this.waxingGibbous;
                txt = this.phases[3];
                break;
            case (phase === 0.5):
                svg = this.fullMoon;
                txt = this.phases[4];
                break;
            case ((phase > 0.5) && (phase < 0.75)):
                svg = this.waningGibbous;
                txt = this.phases[5];
                break;
            case (phase === 0.75):
                svg = this.thirdQuarter;
                txt = this.phases[6];
                break;
            case ((phase > 0.75) && (phase < 1)):
                svg = this.waningCrescent;
                txt = this.phases[7];
                break;
            default:
                svg = this.newMoon;
                txt = this.phases[0];
        }

        return { phase : txt, icon : svg };
    }
}

export default Moon;