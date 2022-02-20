/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from 'react';

const gaugeAvgOffset = 100;
const gaugeMax = 2400;

export default function Game(props: { word: string, difficulty: number }) {

    const [currentWord, setWord] = useState(props.word);
    const [currentDiff, setDifficulty] = useState(props.difficulty);

    function updateWord(word: string) {
        setWord(w => word)
    }
    function updateDiffculty(difficulty: number) {
        setDifficulty(d => difficulty)
    }

    return (
        <>
            <div className='col-md-12 text-center mt-5'><form class="form-inline">
                <form>
                    <div className="form-group mb-2">
                        <label htmlFor="md5" className="sr-only">MD5</label>
                        <input type="text" className="form-control-plaintext" id="md5" value="abcde" placeholder="mot crypté en MD5">
                    </div>
                    <button type="submit" className="btn btn-primary mb-2">Start brutforce</button>
                </form>
            </div>
            
            <div className="d-grid gap-3">
                <button className={`'btn btn-${currentDiff === 0 ? '' : 'outline-'}success`} type="submit" onClick={() => updateDiffculty(0)}>Slow speed</button>
                <button className={`'btn btn-${currentDiff === 1 ? '' : 'outline-'}warning`} type="submit" onClick={() => updateDiffculty(1)}>Median speed</button>
                <button className={`'btn btn-${currentDiff === 2 ? '' : 'outline-'}danger`} type="submit" onClick={() => updateDiffculty(2)}>Quick speed</button>
            </div>
        </>
    )
}
