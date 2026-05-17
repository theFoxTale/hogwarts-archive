import { Component, type ReactNode } from 'react';
import { RoundedFrame } from '../RoundedFrame/RoundedFrame';
import './OrnateFrame.css';

interface OrnateFrameProps {
  children: ReactNode;
  className?: string;
}

export class OrnateFrame extends Component<OrnateFrameProps> {
  render() {
    return (
      <RoundedFrame
        className={`ornate-container ${this.props.className || ''}`}
      >
        {/* Орнаментальные уголки */}
        <span className="ornate-corner ornate-corner-top-left" />
        <span className="ornate-corner ornate-corner-top-right" />
        <span className="ornate-corner ornate-corner-bottom-left" />
        <span className="ornate-corner ornate-corner-bottom-right" />

        {/* Орнаментальные линии */}
        <span className="ornate-line ornate-line-top" />
        <span className="ornate-line ornate-line-bottom" />
        <span className="ornate-line ornate-line-left" />
        <span className="ornate-line ornate-line-right" />

        <div className="ornate-frame-content">{this.props.children}</div>
      </RoundedFrame>
    );
  }
}
