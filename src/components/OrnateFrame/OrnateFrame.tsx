import { Component, type ReactNode } from 'react';
import './OrnateFrame.css';

interface OrnateFrameProps {
  children: ReactNode;
  className?: string;
}

export class OrnateFrame extends Component<OrnateFrameProps> {
  render() {
    return (
      <div className={`gold-frame corner-frame ${this.props.className || ''}`}>
        {/* Уголки */}
        <span className="corner corner-top-left" />
        <span className="corner corner-top-right" />
        <span className="corner corner-bottom-left" />
        <span className="corner corner-bottom-right" />

        {/* Линии рамки */}
        <span className="frame-line frame-line-top" />
        <span className="frame-line frame-line-bottom" />
        <span className="frame-line frame-line-left" />
        <span className="frame-line frame-line-right" />

        {/* Внутренняя рамка с орнаментом */}
        <div className="gold-frame ornate-frame">
          {/* Орнаментальные уголки */}
          <span className="ornate-corner ornate-corner-top-left" />
          <span className="ornate-corner ornate-corner-top-right" />
          <span className="ornate-corner ornate-corner-bottom-left" />
          <span className="ornate-corner ornate-corner-bottom-right" />

          {/* Линии рамки для ornate-frame */}
          <span className="ornate-line ornate-line-top" />
          <span className="ornate-line ornate-line-bottom" />
          <span className="ornate-line ornate-line-left" />
          <span className="ornate-line ornate-line-right" />

          <div className="ornate-frame-content">{this.props.children}</div>
        </div>
      </div>
    );
  }
}
