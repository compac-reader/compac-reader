export function convertBody(html: string) {
  const element = convertElement(html);
  wrappingImageNode(element);
  const textNodes = extractTextNode(element);
  textNodes.forEach((node) => replaceTextNode(node));
  return element.innerHTML;
}

function convertElement(text: string) {
  const element = document.createElement('div');
  element.innerHTML = text;
  return element;
}

function wrappingImageNode(element: HTMLElement) {
  Array.from(element.childNodes).map((node) => {
    if (node.nodeName !== 'IMG') return;
    const wrapper = document.createElement('div');
    wrapper.classList.add('illust');
    node.parentNode!.insertBefore(wrapper, node);
    node.parentNode!.removeChild(node);
    wrapper.appendChild(node);
  });
}

function extractTextNode(element: HTMLElement): CharacterData[] {
  return Array.from(element.childNodes).map((child) => {
    if (child.nodeName === '#text') {
      return child as CharacterData;
    }

    return extractTextNode(child as HTMLElement);
  }).flat();
}

function replaceTextNode(node: CharacterData) {
  node.data = replaceText(node.data);

  const splits = node.data.split(REPLACE_REGEXP);
  if (splits.length < 2) return;
  splits.map((str) => {
    if (str.length === 0) {
      return null;
    } else if (NO_ORIENTATIONS.includes(str)) {
      const element = document.createElement('span');
      element.classList.add('no-orientation');
      element.innerText = str;
      return element;
    } else if (SIDEWAYS_CHARS.includes(str)) {
      const element = document.createElement('span');
      element.classList.add('sideways');
      element.innerText = str;
      return element;
    } else if (COMBINE_CHARS.includes(str)) {
      const element = document.createElement('span');
      element.classList.add('combine');
      str = str.replace(/！/g, '!');
      str = str.replace(/？/g, '?');
      element.innerText = str;
      return element;
    } else {
      return document.createTextNode(str);
    }
  }).forEach((newNode) => {
    if (!newNode) return;
    node.parentNode!.insertBefore(newNode, node);
  });
  node.parentNode!.removeChild(node);
}

function replaceText(text: string) {
  text = text.replace(/\s?\(\s?/g, '（');
  text = text.replace(/\s?\)\s?/g, '）');
  text = text.replace(/\s?!\s?/g, '！');
  text = text.replace(/\s?\?\s?/g, '？');
  text = text.replace(/\s?(“|❝|")\s?/g, '〝');
  text = text.replace(/\s?(”|❞)\s?/g, '〟');
  text = text.replace(/\s?:\s?/g, '：');
  text = text.replace(/\s?;\s?/g, '；');
  text = text.replace(/\s?<\s?/g, '＜');
  text = text.replace(/\s?>\s?/g, '＞');
  text = text.replace(/\s?\[\s?/g, '［');
  text = text.replace(/\s?]\s?/g, '］');
  return text;
}

const NO_ORIENTATIONS = ['…'];
const SIDEWAYS_CHARS = ['＜', '＞', '：', '；', '-', '−', '─', '―', '↑', '→', '↓', '←'];
const COMBINE_CHARS = ['！！！', '！！？', '？？！', '！！', '！？', '？！'];
const REPLACE_REGEXP = new RegExp(`(${NO_ORIENTATIONS.join('|')}|${SIDEWAYS_CHARS.join('|')}|${COMBINE_CHARS.join('|')})`);
