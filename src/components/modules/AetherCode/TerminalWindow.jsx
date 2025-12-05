import React from 'react';
import { GlassCard } from '../../ui/GlassCard';

const codeSnippet = `using UnityEngine;
using System.Collections;

public class PlayerController : MonoBehaviour
{
    private float speed = 5.0f;
    private CharacterController controller;
    
    void Start()
    {
        controller = GetComponent<CharacterController>();
    }
    
    void Update()
    {
        float horizontal = Input.GetAxis("Horizontal");
        float vertical = Input.GetAxis("Vertical");
        
        Vector3 move = transform.right * horizontal + 
                      transform.forward * vertical;
        
        controller.Move(move * speed * Time.deltaTime);
    }
}`;

export const TerminalWindow = () => {
    return (
        <div className="glass-dark rounded-lg overflow-hidden border border-emerald-500/30">
            {/* Terminal Header */}
            <div className="bg-black px-4 py-2 flex items-center justify-between border-b border-slate-700/50">
                <div className="flex items-center gap-2">
                    <span className="mac-dot red"></span>
                    <span className="mac-dot amber"></span>
                    <span className="mac-dot green"></span>
                </div>
                <div className="text-xs font-mono text-slate-500">PlayerController.cs</div>
                <div className="w-12"></div>
            </div>

            {/* Code Editor */}
            <div className="bg-black p-4 h-96 overflow-auto">
                <pre className="text-sm font-mono">
                    <code className="text-emerald-300">{codeSnippet}</code>
                </pre>
            </div>
        </div>
    );
};
